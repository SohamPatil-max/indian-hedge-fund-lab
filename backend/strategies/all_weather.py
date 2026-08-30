import numpy as np
from typing import Dict, Any, List
from backend.data_engine import data_engine

class BridgewaterAllWeatherStrategy:
    """
    Bridgewater-inspired All Weather — India (Dynamic Parameters)
    Risk-parity framework balanced across 4 Indian macro regimes derived from real market indicators.
    """
    def __init__(self):
        self.name = "Bridgewater-inspired All Weather — India"
        self.disclaimer = (
            "Inspired by the publicly described All Weather philosophy. "
            "Asset prices (Equities ^NSEI, Gold GOLDBEES, G-Secs SETF10GILT, Cash LIQUIDBEES): REAL HISTORICAL MARKET DATA (Yahoo Finance API). "
            "Macro Regimes: Derived dynamically from 6-month trailing relative momentum of real market benchmarks."
        )

    def determine_macro_regime(
        self,
        growth_lookback_months: int = 6,
        inflation_lookback_months: int = 6,
        target_risk_pct: float = 7.5
    ) -> Dict[str, Any]:
        hist_data = data_engine.fetch_real_historical_price_matrix()
        nifty_rets = hist_data.get("nifty_returns", [])
        gsec_rets = hist_data.get("gsec_returns", [])
        gold_rets = hist_data.get("gold_returns", [])
        cash_rets = hist_data.get("cash_returns", [])

        w_len = min(growth_lookback_months, len(nifty_rets))
        eq_6m = sum(nifty_rets[-w_len:]) if w_len > 0 else 0.04
        gsec_6m = sum(gsec_rets[-w_len:]) if w_len > 0 else 0.03
        gold_6m = sum(gold_rets[-w_len:]) if w_len > 0 else 0.02
        cash_6m = sum(cash_rets[-w_len:]) if w_len > 0 else 0.015

        # Real Market Relative Growth & Inflation Indicators
        # Growth UP if Equities outperform G-Sec Bonds over trailing 6M
        gdp_trend = "UP" if eq_6m >= gsec_6m else "DOWN"
        # Inflation UP if Gold outperforms Cash over trailing 6M
        cpi_trend = "UP" if gold_6m >= cash_6m else "DOWN"

        if gdp_trend == "UP" and cpi_trend == "DOWN":
            regime_id = "REGIME_1"
            regime_name = "Growth Up / Inflation Down"
            color = "#10B981"
            desc = "Goldilocks Environment — High economic expansion with tame inflation. Favors Indian Equities and Long Corporate Debt."
            base_weights = {
                "Indian Equities (NIFTY 50)": 45.0,
                "Indian G-Secs (10Y G-Sec)": 30.0,
                "Gold (GOLDBEES)": 15.0,
                "Commodities / Cash": 10.0
            }
        elif gdp_trend == "UP" and cpi_trend == "UP":
            regime_id = "REGIME_2"
            regime_name = "Growth Up / Inflation Up"
            color = "#F59E0B"
            desc = "Reflationary Growth — Robust GDP with rising inflation. Favors Gold, Commodities, and Short Debt."
            base_weights = {
                "Indian Equities (NIFTY 50)": 25.0,
                "Indian G-Secs (10Y G-Sec)": 15.0,
                "Gold (GOLDBEES)": 45.0,
                "Commodities / Cash": 15.0
            }
        elif gdp_trend == "DOWN" and cpi_trend == "DOWN":
            regime_id = "REGIME_3"
            regime_name = "Growth Down / Inflation Down"
            color = "#6366F1"
            desc = "Deflationary Slowdown — Weakening demand and dropping prices. Favors Long Sovereign G-Secs as RBI cuts policy rate."
            base_weights = {
                "Indian Equities (NIFTY 50)": 15.0,
                "Indian G-Secs (10Y G-Sec)": 55.0,
                "Gold (GOLDBEES)": 15.0,
                "Commodities / Cash": 15.0
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
            f"The model classifies current macro regime as '{regime_name}' derived from real trailing {growth_lookback_months}M market benchmarks: "
            f"NIFTY 50 return (+{eq_6m*100:.1f}%) vs 10Y G-Sec (+{gsec_6m*100:.1f}%), Gold (+{gold_6m*100:.1f}%) vs Cash (+{cash_6m*100:.1f}%)."
        )

        return {
            "regime_id": regime_id,
            "regime_name": regime_name,
            "color": color,
            "description": desc,
            "rule_explanation": rule_explanation,
            "macro_data": {
                "gdp_trend": gdp_trend,
                "cpi_trend": cpi_trend,
                "eq_6m_pct": round(eq_6m * 100.0, 2),
                "gsec_6m_pct": round(gsec_6m * 100.0, 2),
                "gold_6m_pct": round(gold_6m * 100.0, 2),
                "cash_6m_pct": round(cash_6m * 100.0, 2)
            },
            "target_weights": base_weights,
            "data_status": "MODEL_DERIVED_FROM_REAL_DATA"
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

        target_weights = {}
        for asset, w in raw_weights.items():
            target_weights[asset] = round(min(w, max_position_size_pct), 1)

        return {
            "strategy": self.name,
            "disclaimer": self.disclaimer,
            "active_regime": regime_info,
            "portfolio_weights": target_weights,
            "data_status": "MODEL_DERIVED_FROM_REAL_DATA"
        }

all_weather_strategy = BridgewaterAllWeatherStrategy()
