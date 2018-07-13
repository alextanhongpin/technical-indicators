
## Table of Content

- [Technical Overlays](#technical-overlays)
  - [Bollinger Bands](#bollinger-bands)
  - [Chandelier Exit](#chandelier-exit)
- [Technical Indicators](#technical-indicators)
  - [Accumulation/Distribution Line](#accumulation/distribution-line)
  - [Aroon](#aroon)
  - [Aroon Oscillator](#aroon-oscillator)
  - [Average Directional Index](#average-directional-index)
  - [Average True Range](#average-true-range)
  - [Bollinger Bands](#bollinger-bands)
  - [%B Indicator](#%b-indicator)
  - [Chaikin Money Flow](#chaikin-money-flow)
  - [Chande Trend Meter CTM)(#chande-trend-meter-ctm)
  - [Commodity Channel Index CCI](#commodity-channel-index-cci)
  - [Coppock Curve](#coppock-curve)
  - [Correlation Coefficient](#correlation-coefficient)
  - [DecisionPoint Price Momentum Oscillator)(#decisionpoint-price-momentum-oscillator)
  - Detrended Price Oscillator (DPO)
  - [Simple Moving Average](#simple-moving-average)
- [Reference](#reference)


# [Technical Overlays](#technical-overlays)

## [Bollinger Bands](#bollinger-bands)

A chart overlay that shows the upper and lower limits of 'normal' price movements based on the Standard Deviation of prices.

```
* Middle Band = 20-day simple moving average (SMA)
* Upper Band = 20-day SMA + (20-day standard deviation of price x 2) 
* Lower Band = 20-day SMA - (20-day standard deviation of price x 2)
```

In python:

```python
import numpy as np

a = []

# Standard deviation
std = np.std(a, dtype=np.float64)

# Average
sma = np.average(a)

upper = sma + std * 2
lower = sma + std * 2
```

Depends on: SMA

## [Chandelier Exit](#chandelier-exit)

An indicator that can be used to set trailing stop-losses for both long and short position

```
Chandelier Exit (long) = 22-day High - ATR(22) x 3 
Chandelier Exit (short) = 22-day Low + ATR(22) x 3
```

In python:

```python
a = []
high_22 = max(a)
low_22 = min(a)

# TODO: Get ATR value
```
Depends on: ATR

# [Technical Indicators](#technical-indicators)

## [Accumulation/Distribution Line](#accumulation/distribution-line)

Combines price and volume to show how money may be flowing into or out of a stock.

```               
1. Money Flow Multiplier = [(Close  -  Low) - (High - Close)] /(High - Low) 
2. Money Flow Volume = Money Flow Multiplier x Volume for the Period
3. ADL = Previous ADL + Current Period's Money Flow Volume
```

## [Aroon](#aroon)

Uses Aroon Up and Aroon Down to determine whether a stock is trending or not.

```
Aroon-Up = ((25 - Days since 25-day High) / 25) x 100
Aroon-Down = ((25 - Days since 25-day Low) / 25) x 100
```

```python
data = []

# Create a copy, but reverse it, and take only the last 25 items
reversed_data = data[25::-1] 
high = max(reversed_data)
low = min(reversed_data)

# The most recent High index
recent_high_index = len(reversed_data) - reversed_data.index(high) - 1
recent_low_index = len(reversed_data) - reversed_data.index(low) - 1

aroon_up = ((25 - recent_high_index) / 25) * 100
aroon_down = ((25 - recent_low_index) / 25) * 100
```

## [Aroon Oscillator](#aroon-oscillator)

Measures the difference between Aroon Up and Aroon Down.

```
Aroon Up = 100 x (25 - Days Since 25-day High)/25
Aroon Down = 100 x (25 - Days Since 25-day Low)/25
Aroon Oscillator = Aroon-Up  -  Aroon-Down
```

## [Average Directional Index](#average-directional-index)

ADX shows whether a stock is trending or oscillating.

```
TODO
```

## [Average True Range](#average-true-range)

ATR measures a stock's _volatility_.

**True Range (TR)** is defined as the greatest of the following:

```
Method 1: Current High less the current Low (H - L)
Method 2: Current High less the previous Close, absolute value (|H - Cp|)
Method 3: Current Low less the previous Close, absolute value (|L - Cp|)
```

In python:

```python
m1 = high - low
m2 = abs(high - prev_close)
m3 = abs(low - prev_close)
tr = max(m1, m2, m3)

# Data must have more than 14 points
trs = []
data = []
current_index = len(data)

# At index 14
prior_atr = trs[len(data) - 1]
atr = (prior_atr * 13 + tr) / 14
```

## [Bollinger Bands](#bollinger-bands)

Shows the percentage difference between the upper and lower Bollinger Band. Default setting is Bollinger Bands(20, 2), which means the bands are 2 standard deviations above and below the 20-day simple moving average, which is also the middle band.

```
Percentage Bandwidth = ((Upper Band - Lower Band) / Middle Band) * 100

Where:
  STDEV = 20-day Standard Deviation
  Middle Band = 20-day SMA
  Upper Band = 20-day SMA + 2 * STDEV
  Lower Band = 20-day SMA - 2 * STDEV
```

## [%B Indicator](#%b-indicator)

Shows the relationship between price and standard deviation Bollinger Bands. Uses the default setting for Bollinger Bands(20,2). %B can be used to identify _overbought_ and _oversold_ situations.

```
%B = (Price - Lower Band)/(Upper Band - Lower Band)
```

The six basic relationship levels:

- %B equals 1 when price is at the upper band
- %B equals 0 when price is at the lower band
- %B is above 1 when price is above the upper band
- %B is below 0 when price is below the lower band
- %B is above 0.5 when price is above the middle band (20-day SMA)
- %B is below 0.5 when price is below the middle band (20-day SMA)

Depends on: BollingerBands(20,2), SMA(20)

## [Chaikin Money Flow](#chaikin-money-flow)

Combines price and volume to show how money may be flowing into or out of a stock. Based on Accumulation/Distribution Line.

```
1. Money Flow Multiplier = [(Close - Low) - (High - Close)] / (High - Low)
2. Money Flow Volume = Money Flow Multiplier x Volume for the Period
3. 20-period CMF = 20-period Sum of Money Flow Volume / 20 period Sum of Volume
```

Required: Date, High, Low, Close, Volume


```python
mf_mul = ((close - low) - (high - close)) / (high - low)
mf_vol = mf_mul * vol
cmf20 = mf_vols[:20] / vols[:20]
```

## [Chaikin Oscillator](#chaikin-oscillator)

Combines price and volume to show how money may be flowing into or out of a stock

```
1. Money Flow Multiplier = [(Close - Low) - (High - Close)] / (High - Low)
2. Money Flow Volume = Money Flow Multiplier x Volume for the Period
3. ADL = Previous ADL + Current Period's Money Flow Volume
4. Chaikin Oscillator = (3-day EMA of ADL) - (10-day EMA of ADL)
```

## [Chande Trend Meter CTM)(#chande-trend-meter-ctm)

Scores the stock's trend, based on several technical indicators over six different timeframes.

- The position of high, low, and close, relative to [Bollinger Bands](#bollinger-bands) in four different timeframes (20-day, 50-day, 75-day, and 100-day)
- The price change relative to the standard deviation over the past 100 days
- The 14-day RSI value
- The existence of any short-term (2-day) price channel breakouts

The scales for CTM:

- Stocks with a score of 90-100 are in very strong uptrends
- Stocks with a score of 80-90 are in strong uptrends
- Stocks with a score of 60-80 are in weak uptrends
- Stocks with a score of 20-60 are either flat or in weak downtrends
- Stocks with a score of 0-20 are in very strong downtrends

```
TODO: Calculation
```

## [Commodity Channel Index CCI](#commodity-channel-index-cci)

Shows a stock's variation from it's typical price.

```
CCI = (Typical Price - 20-period SMA of TP) / (0.15 * Mean Deviation)
Typical Price (TP) = (High + Low + Close) / 3
Constant = .15

There are four steps to calculating the Mean Deviation: 
First, subtract the most recent 20-period average of the typical price from each period's typical price. 
Second, take the absolute values of these numbers. 
Third, sum the absolute values. 
Fourth, divide by the total number of periods (20). 
```

## [Coppock Curve](#coppock-curve)

An oscillator that uses rate-or-change and a weighted moving average to measure momentum.

```
Coppock Curve = 10-period WMA of (14-period RoC + 11-period RoC)

WMA = Weighted Moving Average
RoC = Rate-of-Change
```

## [Correlation Coefficient](#correlation-coefficient)

Shows the degree of correlation between two securities over a given timeframe.

```
TODO: Complicated calculation
```

## [DecisionPoint Price Momentum Oscillator)(#decisionpoint-price-momentum-oscillator)

An advanced momentum indicator that tracks a stock's rate of change

```
Smoothing Multiplier = (2 / Time period)
Custom Smoothing Function = {Close - Smoothing Function(previous day)} * Smoothing Multiplier + Smoothing Function(previous day)

PMO Line = 20-period Custom Smoothing of (10 * 35-period Custom Smoothing of (((Today's Price / Yesterday's Price) * 100) - 100))

PMO Signal Line = 10-period EMA of the PMO Line
```

## Detrended Price Oscillator (DPO)

A price oscillator that uses a displaced moving average to identify cycles.

```
Price {X/2 + 1} periods ago less than X-period simple moving average.

X refers to the number of periods used to calculate the Detrended Price Oscillator. A 20-day DPO would use a 20-day SMA that is displayed by 11 periods {20/2 + 1 = 11}. This displacement shifts the 20-day SMA 11 days to the left, which actually puts it in the middle of the look-back period. The value of the 20-day SMA is then subtracted from the price in the middle of the this look-back period. In short, DPO(20) equals price 11 days ago less the 20-day SMA.
```


## [Simple Moving Average](#simple-moving-average)

```python
# TODO: Don't hardcode 20
def sma20(curr_idx, arr):
     arr_len = len(arr)
     if (curr_idx > arr_len):
        raise ValueError('Current index cannot be greater than array length')
     return arr[curr_idx-20:curr_idx]
```



# [Reference](#reference)

- http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators
