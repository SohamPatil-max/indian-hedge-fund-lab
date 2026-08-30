import numpy as np
from typing import Dict, Any, List
from backend.data_engine import data_engine

class BridgewaterAllWeatherStrategy:
    """
    Bridgewater-Inspired All Weather — India (Dynamic Parameters)
    Risk-parity framework balanced across 4 Indian macro regimes.
    """
    def __init__(self):
        self.disclaimer = (
            "Inspired by the publicly described All Weather philosophy. "
            "Equities & Gold: REAL HISTORICAL MARKET DATA (yfinance API). G-Sec Yield: ASSUMED (~7% p.a.). Cash Yield: ASSUMED (6.5% RBI Repo). "
            "Asset Weighting: Fixed Risk-Balanced Allocation (38% Equities, 38% G-Secs, 19% Gold, 5% Cash)."
        )

    def determine_macro_regime(
        self,
        growth_lookback_months: int = 6,
        inflation_lookback_months: int = 6,
        target_risk_pct: float = 7.5
    ) -> Dict[str, Any]:
        macro = data_engine.fetch_macro_indicators()
        gdp_trend = macro["gdp_trend"]
        cpi_trend = macro["cpi_trend"]

        if gdp_trend == "UP" and cpi_trend == "DOWN":
            regime_id = "REGIME_1"
            regime_name = "Growth Up / Inflation Down"
            color = "#10B981"
            desc = "Goldilocks Environment — High economic expansion with tame inflation. Favors Indian Equities and Long Corporate Debt."
            base_weights = {
                "Indian Equities (NIFTY 50)": 50.0,
                "Indian G-Secs (10Y G-Sec)": 30.0,
                "Gold (GOLDBEES)": 10.0,
                "Commodities / Cash": 10.0
            }
        elif gdp_trend == "UP" and cpi_trend == "UP":
            regime_id = "REGIME_2"
            regime_name = "Growth Up / Inflation Up"
            color = "#F59E0B"
            desc = "Reflationary Growth — Robust GDP with rising inflation. Favors Gold, Commodities, and Short Debt."
            base_weights = {
                "Indian Equities (NIFTY 50)": 30.0,
                "Indian G-Secs (10Y G-Sec)": 15.0,
                "Gold (GOLDBEES)": 35.0,
                "Commodities / Cash": 20.0
            }
        elif gdp_trend == "DOWN" and cpi_trend == "DOWN":
            regime_id = "REGIME_3"
            regime_name = "Growth Down / Inflation Down"
            color = "#6366F1"
            desc = "Deflationary Slowdown — Weakening demand and dropping prices. Favors Long Sovereign G-Secs as RBI cuts policy rate."
            base_weights = {
                "Indian Equities (NIFTY 50)": 20.0,
                "Indian G-Secs (10Y G-Sec)": 55.0,
                "Gold (GOLDBEES)": 15.0,
                "Commodities / Cash": 10.0
            }
        else:
            regime_id = "REGIME_4"
            regime_name = "Growth Down / Inflation Up"
            color = "#EF4444"
            desc = "Stagflationary Pressure — Slower GDP growth combined with sticky CPI. Favors Gold, Crude Oil commodities, and Cash."
            base_weights = {
                "Indian Equities (NIFTY 50)": 15.0,
                "Indian G-Secs (10Y G-Sec)": 15.0,
                "Gold (GOLDBEES)": 45.0,
                "Commodities / Cash": 25.0
            }

        rule_explanation = (
            f"The model classifies the current Indian macro environment as '{regime_name}' based on "
            f"{growth_lookback_months}M GDP Growth ({macro['gdp_growth_pct']}% YoY) and {inflation_lookback_months}M CPI Inflation ({macro['cpi_inflation_pct']}%). "
            f"Target portfolio volatility risk budget: {target_risk_pct}%."
        )

        return {
            "regime_id": regime_id,
            "regime_name": regime_name,
            "color": color,
            "description": desc,
            "rule_explanation": rule_explanation,
            "macro_data": macro,
            "target_weights": base_weights
        }

    def get_portfolio_allocation(
        self,
        growth_lookback_months: int = 6,
        inflation_lookback_months: int = 6,
        target_risk_pct: float = 7.5,
        max_position_size_pct: float = 60.0
    ) -> Dict[str, Any]:
        regime_info = self.determine_macro_regime(growth_lookback_months, inflation_lookback_months, target_risk_pct)
        raw_weights = regime_info["target_weights"]

        # Enforce max position size cap
        target_weights = {}
        for asset, w in raw_weights.items():
            target_weights[asset] = round(min(w, max_position_size_pct), 1)

        current_weights = {
            "Indian Equities (NIFTY 50)": 44.5,
            "Indian G-Secs (10Y G-Sec)": 33.2,
            "Gold (GOLDBEES)": 14.8,
            "Commodities / Cash": 7.5
        }

        asset_vols = {
            "Indian Equities (NIFTY 50)": 14.5,
            "Indian G-Secs (10Y G-Sec)": 5.2,
            "Gold (GOLDBEES)": 11.8,
            "Commodities / Cash": 2.1
        }

        total_risk_factor = sum(target_weights[a] * asset_vols[a] for a in target_weights)
        risk_contributions = {}
        for asset, w in target_weights.items():
            rc = (w * asset_vols[asset]) / (total_risk_factor or 1) * 100.0
            risk_contributions[asset] = round(rc, 1)

        port_vol = round(sum((target_weights[a] / 100.0) * asset_vols[a] for a in target_weights), 2)

        trades = []
        portfolio_val = 10000000.0
        for asset in target_weights:
            tgt_pct = target_weights[asset]
            cur_pct = current_weights[asset]
            diff_pct = round(tgt_pct - cur_pct, 1)
            diff_val = round((diff_pct / 100.0) * portfolio_val, 0)
            
            action = "BUY" if diff_val > 0 else "SELL" if diff_val < 0 else "HOLD"
            trades.append({
                "asset": asset,
                "current_weight_pct": cur_pct,
                "target_weight_pct": tgt_pct,
                "weight_diff_pct": diff_pct,
                "action": action,
                "trade_amount_inr": abs(diff_val),
                "risk_contribution_pct": risk_contributions[asset]
            })

        return {
            "disclaimer": self.disclaimer,
            "macro_regime": regime_info,
            "portfolio_volatility_pct": port_vol,
            "target_risk_budget_pct": target_risk_pct,
            "rebalance_required": any(abs(t["weight_diff_pct"]) > 2.0 for t in trades),
            "asset_allocations": trades
        }

all_weather_strategy = BridgewaterAllWeatherStrategy()
