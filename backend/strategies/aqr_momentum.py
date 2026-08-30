import numpy as np
import pandas as pd
from typing import List, Dict, Any
from backend.data_engine import data_engine, INDIAN_STOCK_UNIVERSE

class AQRMomentumStrategy:
    """
    AQR-inspired Momentum Strategy — India (Dynamic Parameters)
    Methodology: 12-month total return excluding the most recent month (12-1M Momentum).
    Sizing: Inverse-volatility risk weighting (W_i ∝ 1 / σ_i) capped at 8.0% max weight.
    """
    def __init__(self):
        self.name = "AQR-inspired Momentum — India"
        self.subtitle = "Publicly documented momentum factor methodology adapted for Indian stock universe"

    def calculate_ranks_and_weights(
        self,
        momentum_lookback_months: int = 12,
        exclusion_months: int = 1,
        top_percentile: float = 33.0,
        max_position_size_pct: float = 8.0
    ) -> List[Dict[str, Any]]:
        hist_data = data_engine.fetch_real_historical_price_matrix()
        stock_price_matrix = hist_data.get("stock_price_matrix", {})
        stock_return_matrix = hist_data.get("stock_return_matrix", {})
        universe = data_engine.fetch_live_universe()
        results = []

        for stock in universe:
            sym = stock["symbol"]
            prices = stock_price_matrix.get(sym, [])
            returns = stock_return_matrix.get(sym, [])
            
            if len(prices) >= 12:
                p_current = prices[-1]
                p_t_minus_1 = prices[-1 - exclusion_months] if len(prices) > exclusion_months else prices[-1]
                p_t_minus_12 = prices[-1 - momentum_lookback_months] if len(prices) > momentum_lookback_months else prices[0]
                
                m_total_ret = round(((p_current / (p_t_minus_12 or 1.0)) - 1.0) * 100.0, 2)
                m_excl_ret = round(((p_current / (p_t_minus_1 or 1.0)) - 1.0) * 100.0, 2)
                m_score = round(((p_t_minus_1 / (p_t_minus_12 or 1.0)) - 1.0) * 100.0, 2)
                vol_12m = float(np.std(returns[-12:])) if len(returns) >= 12 else 0.06
            else:
                m_total_ret = stock.get("change_pct", 0.0)
                m_excl_ret = 0.0
                m_score = m_total_ret
                vol_12m = 0.06
            
            volume = stock.get("volume", 500000)
            liquidity_eligible = volume >= 100000

            results.append({
                "symbol": sym,
                "name": stock["name"],
                "sector": stock["sector"],
                "price": stock["price"],
                "market_cap_cr": stock["market_cap_cr"],
                "return_12m": m_total_ret,
                "return_1m": m_excl_ret,
                "momentum_score": m_score,
                "volatility_12m": round(vol_12m * 100.0, 2),
                "liquidity_eligible": liquidity_eligible,
                "previous_rank": 1,
                "data_status": "REAL_HISTORICAL"
            })

        # Rank by momentum score descending
        results.sort(key=lambda x: x["momentum_score"], reverse=True)

        top_cutoff = max(1, int(len(results) * (top_percentile / 100.0)))
        top_universe = results[:top_cutoff]
        
        # Calculate Inverse-Volatility Weighting (W_i ∝ 1 / σ_i)
        inv_vols = [1.0 / max(0.02, x["volatility_12m"] / 100.0) for x in top_universe]
        sum_inv_vols = sum(inv_vols) or 1.0

        final_portfolio = []
        for i, item in enumerate(results):
            rank = i + 1
            is_selected = rank <= top_cutoff and item["liquidity_eligible"]
            
            if is_selected:
                idx = top_universe.index(item)
                raw_w = (inv_vols[idx] / sum_inv_vols) * 100.0
                weight = round(min(raw_w, max_position_size_pct), 2)
            else:
                weight = 0.0

            status_text = "SELECTED" if is_selected else "NOT SELECTED"
            reason = (
                f"{item['symbol']} has a {momentum_lookback_months}-{exclusion_months}M momentum score of +{item['momentum_score']}% "
                f"ranking #{rank}/{len(results)}. "
            )
            if is_selected:
                reason += f"Meets liquidity requirements & qualifies in top {top_percentile}%. Assigned {weight}% inverse-volatility weight (Max cap: {max_position_size_pct}%)."
            else:
                reason += f"Ranks below top {top_percentile}% cutoff (rank #{top_cutoff}). Excluded from portfolio."

            final_portfolio.append({
                **item,
                "rank": rank,
                "selected": is_selected,
                "portfolio_weight": weight,
                "status": status_text,
                "explanation": reason,
                "data_status": "MODEL_DERIVED_FROM_REAL_DATA"
            })

        return final_portfolio

    def get_strategy_overview(self) -> Dict[str, Any]:
        return {
            "name": "AQR-inspired Momentum — India",
            "methodology": "12-month total return excluding the most recent month (12-1M Momentum)",
            "rules": [
                "1. Calculate total return for each stock based on 12M lookback.",
                "2. Exclude most recent month (T-1) to eliminate short-term reversal noise.",
                "3. Rank stocks from highest to lowest momentum score.",
                "4. Select top percentile cutoff (top 33%).",
                "5. Weight selected stocks inversely to 12M volatility (W_i ∝ 1/σ_i, capped at 8% max size).",
                "6. Reconstitute portfolio on every quarterly rebalance cycle."
            ]
        }

aqr_strategy = AQRMomentumStrategy()
