
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

Shows the percentage difference between the upper and lower Bollinger Band.

```
Percentage Bandwidth = ((Upper Band - Lower Band) / Middle Band) * 100

Where:
  STDEV = 20-day Standard Deviation
  Middle Band = 20-day SMA
  Upper Band = 20-day SMA + 2 * STDEV
  Lower Band = 20-day SMA - 2 * STDEV
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
