#!/usr/bin/env python3
"""Export V17 Excel matrix into data/taxa.json with separate diagnostic_values.
Run from the project directory: python tools/export_excel_v17.py /path/to/workbook.xlsx
Requires openpyxl. Existing taxa.json is used as schema/order reference.
"""
import sys,json
from pathlib import Path
import openpyxl
root=Path(__file__).resolve().parents[1]
path=Path(sys.argv[1]) if len(sys.argv)>1 else None
if not path or not path.is_file():raise SystemExit('Usage: python tools/export_excel_v17.py EXCEL_FILE.xlsx')
wb=openpyxl.load_workbook(path,read_only=False,data_only=True)
mat=wb['2_traits_matrix'];tax=wb['1_taxa'];header={mat.cell(2,c).value:c for c in range(4,mat.max_column+1)}
rows={mat.cell(r,1).value:r for r in range(5,mat.max_row+1)}
tr={tax.cell(r,1).value:r for r in range(3,tax.max_row+1)}
allowed={}
for row in wb['4_trait_states'].iter_rows(min_row=2,values_only=True):
 if row[0] and row[1]:allowed.setdefault(row[0],set()).add(str(row[1]))
obj=json.loads((root/'data/taxa.json').read_text(encoding='utf-8'))
if set(x['id'] for x in obj)!=set(rows):raise ValueError('Taxon IDs differ from existing JSON; review export logic')
for entry in obj:
 tx=entry['id'];r=rows[tx]; values={}; diagnostic={}
 for code,c in header.items():
  if code not in allowed:continue
  raw=mat.cell(r,c).value
  if raw is None or not str(raw).strip():continue
  vals=[];marks=[]
  for part in str(raw).split('|'):
   part=part.strip()
   if not part:continue
   if part.count('#!')>1 or ('#!' in part and not part.endswith('#!')):raise ValueError((tx,code,part))
   highlight=part.endswith('#!');value=part.removesuffix('#!').strip()
   if value not in allowed.get(code,set()):raise ValueError((tx,code,value))
   if value not in vals:vals.append(value)
   if highlight and value not in marks:marks.append(value)
  if vals:values[code]=vals
  if marks:diagnostic[code]=marks
 entry['values']=values;entry['diagnostic_values']=diagnostic
 for field,c in [('description_de',18),('description_en',19),('habitat_de',20),('habitat_en',21)]:entry[field]=str(tax.cell(tr[tx],c).value or '')
(root/'data/taxa.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
meta_path=root/'data/metadata.json';meta=json.loads(meta_path.read_text(encoding='utf-8'))
meta.update({'source_file':path.name,'base_excel_version':'V23','editorial_revision':'V17','described_taxa_count':sum(bool(x['description_de']) for x in obj),'diagnostic_taxa_count':sum(bool(x['diagnostic_values']) for x in obj),'diagnostic_state_count':sum(sum(map(len,x['diagnostic_values'].values())) for x in obj),'botanical_review':'pending'})
meta_path.write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Exportiert:',len(obj),'Taxa')
