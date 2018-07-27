from scipy.stats import norm, chi2_contingency
import statsmodels.api as sm
import numpy as np
import sys, json

# z1, p_value1 = sm.stats.proportions_ztest(8,29,.226,'larger')
# print(['{:.12f}'.format(b) for b in (z1, p_value1)])

def get_params():
    lines = sys.stdin.readlines()
    # print('get_params is running.')
    # print(lines)
    return json.loads(lines[0])

def main():
    params = get_params()
    z1, p_value1 = sm.stats.proportions_ztest(params[0],params[1],params[2],params[3],params[2])
    print(z1,p_value1)


if __name__ == '__main__':
    main()
