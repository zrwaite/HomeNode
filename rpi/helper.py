"""
Helper file for random functions
"""

def format_serial_data(data_string):
        data_list = data_string.strip().replace('\n','').replace('\r','/').replace('\\','').split('/')
        data_dict = {}
        for index, value in enumerate(data_list):
            if index % 2 == 0 and index + 1 < len(data_list):
                if data_list[index + 1] != "":
                    data_dict[data_list[index]] = float(data_list[index+1].replace('\\','').strip())
        
        return data_dict