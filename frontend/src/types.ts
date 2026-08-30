export interface MarketStatus {
  status_code: 'LIVE' | 'DELAYED' | 'OFFLINE' | 'CLOSED' | 'WEEKEND' | 'HOLIDAY';
  is_open?: boolean;
  is_live?: boolean;
  icon?: string;
  description: string;
  timestamp: string;
  universe_size?: number;
  benchmark?: string;
  provider?: string;
  quote_type?: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  change_pct: number;
  open: number;
  high: number;
  low: number;
  prev_close: number;
  volume: number;
  market_cap_cr: number;
  pe_ratio: number;
  pb_ratio: number;
  roe_pct: number;
  status?: string;
  quote_type?: string;
}

export interface IndexQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_pct: number;
  timestamp: string;
  price_type: 'LIVE' | 'LAST_CLOSE' | 'DELAYED';
  market_status: string;
}

export interface IndexTicker {
  index_name: string;
  symbol: string;
  price: number;
  change: number;
  change_pct: number;
  quote_type?: string;
  market_status?: string;
  timestamp?: string;
  sensex?: IndexQuote;
  market_breadth: {
    advances: number;
    declines: number;
    unchanged: number;
    ratio: number;
  };
  top_gainers: StockQuote[];
  top_losers: StockQuote[];
}

export interface AQRStockItem {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  market_cap_cr: number;
  return_12m: number;
  return_1m: number;
  momentum_score: number;
  liquidity_eligible: boolean;
  previous_rank: number;
  rank: number;
  selected: boolean;
  portfolio_weight: number;
  status: string;
  explanation: string;
}

export interface AllWeatherAsset {
  asset: string;
  current_weight_pct: number;
  target_weight_pct: number;
  weight_diff_pct: number;
  action: 'BUY' | 'SELL' | 'HOLD';
  trade_amount_inr: number;
  risk_contribution_pct: number;
}

export interface AllWeatherResponse {
  disclaimer: string;
  macro_regime: {
    regime_id: string;
    regime_name: string;
    color: string;
    description: string;
    rule_explanation: string;
    macro_data: Record<string, any>;
    target_weights: Record<string, number>;
  };
  portfolio_volatility_pct: number;
  rebalance_required: boolean;
  asset_allocations: AllWeatherAsset[];
}

export interface ThesisCardData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  status: string;
  overall_score: number;
  scores: {
    valuation: number;
    quality: number;
    catalyst: number;
  };
  metrics: {
    pe_ratio: number;
    pb_ratio: number;
    ev_ebitda: number;
    fcf_yield_pct: number;
    roe_pct: number;
    roce_pct: number;
    debt_equity: number;
    profit_growth_pct: number;
  };
  catalyst_details: {
    identified: boolean;
    type: string;
    timeline_months: number;
    conviction: string;
  };
  investment_thesis: string;
  target_price: number;
  stop_loss_price: number;
  expected_upside_pct: number;
  downside_risk_pct: number;
  risk_reward_ratio: number;
  exit_triggers: string[];
}

export interface TradeRecord {
  trade_id: string;
  date: string;
  strategy: string;
  symbol: string;
  company_name: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  execution_price: number;
  gross_trade_value: number;
  transaction_cost: number;
  slippage: number;
  net_trade_value: number;
  position_after_trade: number;
  realized_pnl: number;
  unrealized_pnl: number;
  holding_period_days: number;
  signal_reason: string;
  portfolio_nav: number;
  portfolio_weight_pct: number;
  management_fee_inr: number;
  performance_fee_inr: number;
}

export interface FeeBreakdown {
  management_fee_pct: number;
  performance_fee_pct: number;
  annual_mgmt_fee_est: number;
  monthly_mgmt_fee_est: number;
  cumulative_mgmt_fees_inr: number;
  cumulative_perf_fees_inr: number;
  total_fees_paid_inr: number;
  high_water_mark_inr: number;
}

export interface FundAllocation {
  total_aum_cr: number;
  aqr_alloc_pct: number;
  all_weather_alloc_pct: number;
  activist_alloc_pct: number;
  total_alloc_pct: number;
  unallocated_cash_pct: number;
  aqr_capital_cr: number;
  all_weather_capital_cr: number;
  activist_capital_cr: number;
  unallocated_cash_cr: number;
  aqr_pnl_cr: number;
  all_weather_pnl_cr: number;
  activist_pnl_cr: number;
  cash_pnl_cr?: number;
  total_fund_pnl_cr: number;
  daily_pnl_cr?: number;
  daily_pnl_inr?: number;
  ytd_return_pct?: number;
  fund_nav: number;
  is_valid: boolean;
}

export interface BacktestResult {
  run_id?: string;
  last_calculated?: string;
  strategy_key: string;
  strategy_name: string;
  fund_allocation: FundAllocation;
  positions?: Array<{
    symbol: string;
    company_name: string;
    price: number;
    weight_pct: number;
    quantity?: number;
  }>;
  parameters: {
    total_aum_cr?: number;
    initial_capital: number;
    start_date: string;
    end_date: string;
    rebalance_frequency: string;
    transaction_cost_pct: number;
    slippage_pct: number;
    management_fee_pct: number;
    performance_fee_pct: number;
    max_position_size_pct?: number;
  };
  performance: {
    initial_capital: number;
    final_gross_value: number;
    final_net_value: number;
    strategy_pnl_inr?: number;
    gross_total_return_pct: number;
    gross_cagr_pct: number;
    net_total_return_pct: number;
    net_cagr_pct: number;
    ytd_return_pct?: number;
    annualized_volatility_pct: number;
    sharpe_ratio?: number;
    max_drawdown_pct?: number;
    sortino_ratio?: number;
    benchmark_total_return_pct: number;
    benchmark_cagr_pct: number;
  };
  fee_breakdown: FeeBreakdown;
  risk: {
    max_drawdown_pct: number;
    sharpe_ratio: number;
    sortino_ratio: number;
    var_95_pct: number;
    beta_vs_nifty: number;
  };
  trading: {
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    win_rate_pct: number;
    avg_gain_pct?: number;
    avg_loss_pct?: number;
    profit_factor: number;
    turnover_pct: number;
    total_costs_paid_inr: number;
  };
  equity_curve: Array<{
    date: string;
    gross_portfolio_value: number;
    net_investor_value: number;
    high_water_mark: number;
    benchmark_nifty: number;
    drawdown_pct: number;
    cumulative_mgmt_fees: number;
    cumulative_perf_fees: number;
    cumulative_total_fees: number;
    nav: number;
  }>;
  monthly_returns_heatmap: Array<Record<string, any>>;
  all_trades: TradeRecord[];
  recent_trades: TradeRecord[];
}

export interface FundHolding {
  symbol: string;
  name: string;
  sector: string;
  quantity: number;
  avg_cost_price: number;
  current_price: number;
  day_change_pct: number;
  cost_value: number;
  current_value: number;
  unrealized_pnl_inr: number;
  unrealized_pnl_pct: number;
  holding_days: number;
  weight_pct: number;
}

export interface SimulatedFundState {
  run_id?: string;
  last_calculated?: string;
  fund_name: string;
  total_aum_cr?: number;
  fund_allocation?: FundAllocation;
  nav: number;
  gross_aum_inr: number;
  net_aum_inr: number;
  starting_capital_inr: number;
  cash_balance_inr: number;
  gross_total_return_pct: number;
  net_total_return_pct: number;
  ytd_return_pct?: number;
  daily_pnl_inr: number;
  daily_pnl_pct: number;
  unrealized_pnl_inr: number;
  realized_pnl_inr: number;
  strategy: string;
  risk_level: string;
  fees: FeeBreakdown;
  holdings: FundHolding[];
  sector_exposure: Record<string, number>;
}
