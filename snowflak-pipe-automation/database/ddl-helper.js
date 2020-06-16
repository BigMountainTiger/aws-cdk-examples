const table_name = 'UnusedData';
const s = 'CorelogicDataID|Appreciation|AVM|CountyId|Estimated CLTV|First MTG Amount|First MTG Assigned Lender|First MTG Fixed Rate Loan Ind|First MTG Lender Name|First MTG Loan Type|First MTG LTV|First MTG Origination Date|First MTG Refinance Loan Ind|First MTG Variable Rate Loan Ind|Junior MTG Amount|Junior MTG Assigned Lender|Junior MTG Lender Name|Junior MTG Origination Date|Junior MTG Subordinate Type|LandUseDescriptionID|LastUsed|Mailing Address Full|Mailing City|Mailing State|Mailing Zip Code|MailingZipCodeId|Owner 1 First Name|Owner 1 Last Name|Owner 2 First Name|Owner 2 Last Name|Property Address Full|Property City|Property State|Property Zip Code|PropertyStateId|PropertyZipCodeId|ReferenceNr|Tax Amount|Estimated Equity|First MTG ARM Next Reset Date|First MTG ARM Maximum Interest Rate|Junior MTG Equity Loan Ind|FormattedCountyName|MailingStateId|County Name|First MTG ARM Change Percent Limit|PrevailingInterestRate|First MTG ARM Initial Reset Date|First MTG ARM Change Interval|First MTG ARM Change Freq|First MTG ARM First Change Max Pct|First MTG ARM Calculation Change|First MTG Interest Rate|First MTG Term|First MTG Interest Rate Type|APN Unformatted|APN Sequence Number|FIPS|First MTG Modified Ind|Owner Occupied Indicator|First MTG ARM Index Type|DownPmtAssistFGrant_Ind|First MTG Loan Purpose|MonthlySavingQuoteRate|ConsolidationMonthlySavingsAmt|ConsolidationMonthlySavingsPercent|NewConfLoanLimit|DataProviderID|MailingAddressIsLenderAddress|CurrentPrevailingInterestRate|DifferencePrevailingInterestRate|MonthlySavingPrevailingInterestRate';

const a = s.split('|');

let r = '';
let len = a.length;
for (let i = 0; i < len; i++) {

  const item = a[i]
    .replace(/ /g, '_')
    .replace(/-/g, '_');
  const line_end = (i == len - 1)? '\n' : ', \n'
  r = `${r}\t${item} VARCHAR${line_end}`;
}

console.log(len);

const table_create_query = `CREATE OR REPLACE TABLE ${table_name} (
  ${r}
);`;
console.log(table_create_query);