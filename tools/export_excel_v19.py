#!/usr/bin/env python3
"""Export genera descriptions from sheet 5_genera. First run export_excel_v18.py for taxa/traits/metadata when changing source matrix."""
import json,sys
from pathlib import Path
import openpyxl
root=Path(__file__).resolve().parents[1]
p=Path(sys.argv[1]) if len(sys.argv)>1 else None
if p is None or not p.is_file(): raise SystemExit('Usage: python tools/export_excel_v19.py WORKBOOK.xlsx')
w=openpyxl.load_workbook(p,read_only=True,data_only=True)
s=w['5_genera']; rows=list(s.values); headers=rows[0]; out=[]
for row in rows[1:]:
 if not row[1]:continue
 o=dict(zip(headers,row))
 if not o['genus_name']:raise ValueError('Missing genus name')
 out.append({k:(v or '') for k,v in o.items()})
if len(set(x['genus_name'] for x in out))!=len(out):raise ValueError('Duplicate genus')
(root/'data/genera.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Exported {len(out)} genus descriptions')
