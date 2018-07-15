
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
  <!-- - [mon](#money-flow-index-mfi) -->
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


## Ichimoku Cloud

A comprehensive indicator that defines support and resistance, identifies trend direction, gauges momentume and provides trading signals.

```
Tenkan-sen (Conversion Line): (9-period high + 9-period low)/2))

The default setting is 9 periods and can be adjusted. On a daily chart, this line is the midpoint of the 9-day high-low range, 
which is almost two weeks.  
```


```
Kijun-sen (Base Line): (26-period high + 26-period low)/2))

The default setting is 26 periods and can be adjusted. On a daily chart, this line is the midpoint of the 26-day high-low range, which is almost one month).  
```

```
Senkou Span A (Leading Span A): (Conversion Line + Base Line)/2))

This is the midpoint between the Conversion Line and the Base Line. The Leading Span A forms one of the two Cloud boundaries. It is referred to as "Leading" because it is plotted 26 periods in the future and forms the faster Cloud boundary. 
```

```
Senkou Span B (Leading Span B): (52-period high + 52-period low)/2))

On the daily chart, this line is the midpoint of the 52-day high-low range, which is a little less than 3 months. The default calculation setting is 52 periods, but can be adjusted. This value is plotted 26 periods in the future and forms the slower Cloud boundary.
```

```
Chikou Span (Lagging Span): Close plotted 26 days in the past

The default setting is 26 periods, but can be adjusted. 
```


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

## Ease of Movement

  Short name: EMV

An indicator that compares volume and price to identify significant moves.

```
Distance Moved = ((H + L) / 2) - (Prior H + Prior L) / 2)
Box Ratio = ((V/100,000,000)/(H - L))

1-Period EMV = ((H + L) / 2 - (Prior H + Prior L) / 2) / ((V/100,000,000)/(H - L))
14-Period Ease of Movement = 14-Period simple moving average of 1-period EMV
```

## Force Index

A simple price-and-volume oscillator.

```
Force Index(1) = {Close (current period) - Close(prior period)} x Volume
Force Index(13) = 13-Period EMA of Force Index(1)
```

## Mass Index

An indicator that identifies reversals when the price range widens.

```
Single EMA = 9-period exponential moving average (EMA) of the high-low differential
Double EMA = 9-period EMA of the 9-period EMA of the high-low differential
EMA Ratio = Single EMA divided by the Double EMA
Mass Index = 25-period sum of the EMA Ratio
```

## Moving Average Convergence/Divergence Oscillator (MACD)

A momentum oscillator based on the difference between two EMAs.

```
MACD Line: (12-day EMA - 26-day EMA)
Signal Line: 9-day EMA of MACD Line
MACD Histogram: MACD Line - Signal Line
```

## MACD Histogram

A momentum oscillator that shows the difference between MACD and its signal line.

```
MACD: (12-day EMA - 26-day EMA)
Signal Line: 9-day EMA of MACD
MACD Histogram: MACD - Signal Line
```

## Money Flow Index (MFI)

A volume-weighted version of RSI that shows shifts is buying and selling pressure.

```
Typical Price = (High + Low + Close) / 3
Raw Money Flow = Typical Price x Volume
Money Flow Ratio = (14-period Positive Money Flow) / (14-period Negative Money Flow)
Money Flow Index = 100 - 100 / (1 + Money Flow Ratio)
```

## Negative Volume Index (NVI)

A cumulative volume-based indicator used to identify trend reversals.

```
1. Cumulative NVI starts at 1000
2. Add the Percentage Price Change to cumulative NVI when Volume Decreases.
3. Cumulative NVI is Unchanged when Volume Increases
4. Apply a 255-day EMA for Signals
```

## On Balance Volume (OBV)

Combines price and volume in a very simple way to show how money may be flowing into or out of stock.

```
If the closing price is above the prior close price then:
Current OBV = Previous OBV + Current Volume

If the closing price is below the prior close price then:
Current OBV = Previous OBV - Current Volume

If the closing prices equals the prior close price then:
Current OBV = Previous OBV (no change)
```

## Percentage Price Oscillator (PPO)

A percentage-based version of the MACD indicator.

```
Percentage Price Oscillator (PPO): {(12-day EMA - 26-day EMA) / 26-day EMA} x 100
Signal Line: 9-day EMA of PPO
PPO Histogram: PPO - Signal Line
```

## Percentage Volume Oscillator (PVO)

The PPO indicator applied to volume instead of price.

```
Percentage Volume Oscillator (PVO):

((12-day EMA of Volume - 26-day EMA of Volume) / 26-day EMA of Volume) x 100
Signal Line: 9-day EMA of PVO
PVO Histogram: PVO - Signal Line
```

## Price Relative/Relative Strength

Technical Indicator that compares the performance of two stocks to each other by dividing their price data.

```
Price Relative = Base Security / Comparitive Security

Ratio Symbol Close = Close of First Symbol / Close of Second Symbol
Ratio Symbol Open  = Open of First Symbol / Open of Second Symbol
Ratio Symbol High  = High of First Symbol / High of Second Symbol
Ratio Symbol Low   = Low of First Symbol / Low of Second Symbol
```

## Pring's Know Sure Thing (KST)

A momentum oscillator from Martin Pring based on the smoothed rate-of-change for four different timeframes.

```
RMCA1 = 10-period SMA of 10-period rate-of-change
RMCA2 = 10-period SMA of 15-period rate-of-change
RMCA3 = 10-period SMA of 20-period rate-of-change
RMCA4 = 15-period SMA of 30-period rate-of-change

KST = (RCMA1 x 1) + (RCMA2 x 2) + (RCMA3 x 3) + (RCMA4 x 4)

Signal Line = 9-period SMA of KST
```

## Rate of Change (ROC) and Momentum

Shows the speed at which the stock's price is changing.

```
ROC = [(Close - Close n periods ago) / (Close n periods ago)] * 100
```

## Relative Strength Index (RSI)

Shows how strongly a stock is moving in its current direction.

```
RSI = 100 - (100 / (1 + RS))
RS = Average Gain / Average Loss

where 
First Average Gain = Sum of Gains over the past 14 periods / 14
First Average Loss = Sum of Losses over the past 14 periods / 14

Subsequently:

Average Gain = [(previous Average Gain) x 13 + current Gain] / 14
Average Loss = [(previous Average Loss) x 13 + current Loss] / 14
```

## RRG Relative Strength

Uses RS-Ratio to measure relative performance and RS-Momentum to measure the momentum of relative performance.

## StockCharts Technical Rank (SCTR)

```
Long-Term Indicators (weighting)
--------------------------------

  * Percent above/below 200-day EMA (30%)
  * 125-Day Rate-of-Change (30%)

Medium-Term Indicators (weighting)
----------------------------------

  * Percent above/below 50-day EMA (15%)
  * 20-day Rate-of-Change (15%)

Short-Term Indicators (weighting)
---------------------------------

  * 3-day slope of PPO-Histogram (5%)
  * 14-day RSI (5%)
```

## Slope 

Measures the rise-over-run for a linear regression.

## Standard Deviation (Volatility)

A statistical measure of a stock's volatility.


```
1. Calculate the average (mean) price for the number of periods or observations.
2. Determine each period's deviation (close less average price).
3. Square each period's deviation.
4. Sum the squared deviations.
5. Divide this sum by the number of observations.
6. The standard deviation is then equal to the square root of that number.
```

## Stochastic Oscillator (Fast, Slow, Pull)

Shows how a stock's price is doing relative to past movements. Fast, Slow and Full stochastics are explained.

```
%K = (Current Close - Lowest Low)/(Highest High - Lowest Low) * 100
%D = 3-day SMA of %K

Lowest Low = lowest low for the look-back period
Highest High = highest high for the look-back period
%K is multiplied by 100 to move the decimal point two places
```

## StochRSI

Combines Stochastic with the RSI indicator to help you see RSI changes more clearly.

```
StochRSI = (RSI - Lowest Low RSI) / (Highest High RSI - Lowest Low RSI)
```

## TRIX

A triple-smoothed moving average of price movements.

## True Strength Index

An indicator that measures trend direction and identifies overbought/oversold levels.

```
Double Smoothed PC
------------------
PC = Current Price minus Prior Price
First Smoothing = 25-period EMA of PC
Second Smoothing = 13-period EMA of 25-period EMA of PC

Double Smoothed Absolute PC
---------------------------
Absolute Price Change |PC| = Absolute Value of Current Price minus Prior Price
First Smoothing = 25-period EMA of |PC|
Second Smoothing = 13-period EMA of 25-period EMA of |PC|

TSI = 100 x (Double Smoothed PC / Double Smoothed Absolute PC)
```

## Ulcer Index

```
Percent-Drawdown = ((Close - 14-period Max Close)/14-period Max Close) x 100

Squared Average = (14-period Sum of Percent-Drawdown Squared)/14 

Ulcer Index = Square Root of Squared Average
```

## Ultimate Oscillator

Combines long-term, mid-term and short-term moving averages into one number.

```
P = Close - Minimum(Low or Prior Close).
 
TR = Maximum(High or Prior Close)  -  Minimum(Low or Prior Close)

Average7 = (7-period BP Sum) / (7-period TR Sum)
Average14 = (14-period BP Sum) / (14-period TR Sum)
Average28 = (28-period BP Sum) / (28-period TR Sum)

UO = 100 x [(4 x Average7)+(2 x Average14)+Average28]/(4+2+1)
```


## Vortex Indicator

An indicator designed to identify the start of a new trend and define the current trend.

```
Positive and negative trend movement:

+VM = Current High less Prior Low (absolute value)
-VM = Current Low less Prior High (absolute value)

+VM14 = 14-period Sum of +VM
-VM14 = 14-period Sum of -VM


True Range (TR) is the greatest of:

  * Current High less current Low
  * Current High less previous Close (absolute value)
  * Current Low less previous Close (absolute value)

TR14 = 14-period Sum of TR


Normalize the positive and negative trend movements:

+VI14 = +VM14/TR14
-VI14 = -VM14/TR14
```

## Williams %R

Uses Stochastic to determine overbought and oversold levels.

```
%R = (Highest High - Close)/(Highest High - Lowest Low) * -100

Lowest Low = lowest low for the look-back period
Highest High = highest high for the look-back period
%R is multiplied by -100 correct the inversion and move the decimal.
```



# [Reference](#reference)

- http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators


```python
def Gen(n):
  i = 0
  while i < n:
    yield i
    i += 1

list((i for i in Gen(10)))


def memory_generator(data):
  prev = 0
  for i in data:
    yield i
    prev = prev + i
    print(prev)
```


## Generator Sample

```python
def multiples(of):
    """Yields all multiples of given integer."""
    x = of
    while True:
        yield x
        x += of

>>> from itertools import islice
>>> list(islice(multiples(of=5), 10))
[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
```