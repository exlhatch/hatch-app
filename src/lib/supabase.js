export const SB_URL="https://vjuhpnuiwhbxmnqrraqt.supabase.co";
export const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdWhwbnVpd2hieG1ucXJyYXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTY3MDcsImV4cCI6MjA5NDA5MjcwN30.NkfQyKb1E4ijADieEmie3h0mmsRHJHOrhaH2dhMnmpA";
const H={"Content-Type":"application/json","apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Prefer":"return=representation"};
export async function sbInsert(table,data){try{const r=await fetch(`${SB_URL}/rest/v1/${table}`,{method:"POST",headers:H,body:JSON.stringify(data)});return r.ok}catch{return false}}
export async function sbSelect(table,query=""){try{const r=await fetch(`${SB_URL}/rest/v1/${table}?${query}`,{headers:{"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`}});return r.ok?await r.json():[]}catch{return[]}}
export async function sbUpdate(table,match,data){try{const r=await fetch(`${SB_URL}/rest/v1/${table}?${match}`,{method:"PATCH",headers:H,body:JSON.stringify(data)});return r.ok}catch{return false}}
export async function sbDelete(table,match){try{const r=await fetch(`${SB_URL}/rest/v1/${table}?${match}`,{method:"DELETE",headers:H});return r.ok}catch{return false}}
