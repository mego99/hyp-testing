from scipy import stats as sp
import statsmodels.api as sm
import numpy as np
import sys, json

response = {}

#get parameters passed in from API
def get_params():
    lines = sys.stdin.readlines()
    return lines[0]

def main():
    params = json.loads(get_params(), object_hook=to_float)
    type = params['type'] #variable for the type of statistical test selected by the user

    if (type == 'z1'):
        z1, p_value1 = sm.stats.proportions_ztest(params['suc'],params['n'],params['prop'],params['alt'],params['prop'])
        response['teststat'] = z1
        response['pval'] = p_value1
    elif (type == 'z2'):
        prop = (params['suc1'] + params['suc2']) / (params['n1'] + params['n2'])
        z1, p_value1 = sm.stats.proportions_ztest([params['suc1'],params['suc2']],[params['n1'],params['n2']],0,params['alt'],prop)
        response['teststat'] = z1
        response['pval'] = p_value1
    elif (type == 't1'):
        tstat, pval = sp.stats.ttest_ind_from_stats(mean1=params['xbar'], #use scipy's 2 mean ttest function for the 1 mean ttest
                                      std1=params['xsd'],
                                      nobs1=params['n'],
                                      mean2=params['mu'],
                                      std2=0,
                                      nobs2=2, #doesn't matter what this value is as long as it's greater than 0
                                      equal_var=False)
        response['teststat'] = tstat
        if (params['alt'] == 'two-sided'):
            response['pval'] = pval
        else:
            response['pval'] = pval / 2

    elif (type == 't2'):
        tstat, pval = sp.stats.ttest_ind_from_stats(mean1=params['xbar1'],
                                      std1=params['xsd1'],
                                      nobs1=params['n1'],
                                      mean2=params['xbar2'],
                                      std2=params['xsd2'],
                                      nobs2=['n2'],
                                      equal_var=False)
        response['teststat'] = tstat
        if (params['alt'] == 'two-sided'):
            response['pval'] = pval
        else:
            response['pval'] = pval / 2

    print(json.dumps(response)) #the print statement gets outputted into stdout which is read by the api
    sys.stdout.flush()

# convert numerical strings in the JSON to floats
def to_float(obj):
    for value in obj:
        try:
            obj[value] = float(obj[value])
        except ValueError:
            obj[value]
    return obj

if __name__ == '__main__':
    main()
