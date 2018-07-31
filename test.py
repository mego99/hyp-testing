import statsmodels.api as sm
import numpy as np
import sys, json
from scipy import stats as sp

response = {}

z1, p_value1 = sm.stats.proportions_ztest([40,30],[70,50],0,"smaller",((40+30)/(70+50)) )
response['teststat'] = z1
response['pval'] = p_value1

print(json.dumps(response))

print('------------------------')

st, pva = sp.stats.ttest_ind_from_stats(mean1=0.0713,
                              std1=0.0495,
                              nobs1=150,
                              mean2=0.08,
                              std2=0,
                              nobs2=2,
                              equal_var=False)

print(st, pva)
