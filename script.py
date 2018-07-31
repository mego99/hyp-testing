from scipy.stats import norm, chi2_contingency
import statsmodels.api as sm
import numpy as np
import sys, json

# z1, p_value1 = sm.stats.proportions_ztest(8,29,.226,'larger')
# print(['{:.12f}'.format(b) for b in (z1, p_value1)])

response = {}

def get_params():
    lines = sys.stdin.readlines()
    # print('json loads below')
    # print(json.dump(lines[0], object_hook=to_float))
    # response.append(lines)
    # print(lines[0])
    return lines[0]
    # return '{"suc":"5","n":"10","prop":"0.168","alt":"larger"}'
    # return '{"suc": 5,"n": 10,"prop": 0.168,"alt": "larger"}'

# def get_params():
#     return '{"suc":"5","n":"10","prop":"0.168","alt":"larger"}'


def main():
    # print(get_params())
    # sys.stdout.flush()
    # str = "{'suc': '5', 'n': '10', 'prop': '0.168', 'alt': 'larger'}"
    params = json.loads(get_params(), object_hook=to_float)
    # print(params)
    # sys.stdout.flush()
    # response.append(params)
    z1, p_value1 = sm.stats.proportions_ztest(params['suc'],params['n'],params['prop'],params['alt'],params['prop'])
    response['teststat'] = z1
    response['pval'] = p_value1
    print(json.dumps(response))
    sys.stdout.flush()

def to_float(obj):
    for value in obj:
        try:
            obj[value] = float(obj[value])
        except ValueError:
            obj[value]
    return obj

if __name__ == '__main__':
    main()
