var propertyData = 
{
    'chi' : 
    {
        '4' : 
        {
            property : '物業',
            date : '視察日期',
            relation : '代理關係',
            user : '買方所須支付的佣金的數額或收費率',
            right : '買方放棄收取物業資料表格(包括賣方的陳述)的權利',
            seller : '賣方所須支付的佣金(如適用的話)的數額或收費率',
        },
        '6':
        {
            property : '物業',
            date : '視察日期',
            relation : '代理關係',
            user : '租客所須支付的佣金的數額或收費率',
            right : '租客放棄收取出租物業資料表格的權利',
            seller : '業主所須支付的佣金(如適用的話)的數額或收費率',
        }
    },
    'eng' : {
        '4' : 
        {
            property : 'Properties',
            date : 'Date of inspection (please specify if Purchaser agrees not to inspect)',
            relation : 'Agency Relationship',
            user : 'Amount or rate of commission to be paid by Purchaser',
            right : 'Purchaser waives his right to receive Property Information Forms including Vendor’ s Statements',
            seller : 'Amount or rate of commission to be paid by vendor, if applicable',
        },
        '6':
        {
            property : 'Properties',
            date : 'Date of inspection (please specify if Purchaser agrees not to inspect)',
            relation : 'Agency Relationship',
            user : 'Amount or rate of commission to be paid by Tenant',
            right : 'Tenant waives his right to receive Leasing Information Forms',
            seller : 'Amount or rate of commission to be paid by landlord, if applicable',
        }
    }
};

module.exports = propertyData;