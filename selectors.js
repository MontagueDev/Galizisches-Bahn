/** Pure selectors keep derived railway/account state out of rendering code. */
export function selectUnreadCount(state){return (state.notificationInbox||[]).filter(item=>!item.read).length;}

export function selectJourneyGroups(state,getLive){
  const groups={upcoming:[],current:[],completed:[]};
  (state.tickets||[]).filter(ticket=>ticket.kind!=='urban'&&ticket.status!=='cancelled').forEach(ticket=>{
    const live=getLive(ticket);
    const entry={ticket,live};
    if(['underway','boarding','atStation','borderControl'].includes(live.status))groups.current.push(entry);
    else if(live.status==='completed')groups.completed.push(entry);
    else groups.upcoming.push(entry);
  });
  groups.upcoming.sort((a,b)=>a.live.actualStart-b.live.actualStart);
  groups.current.sort((a,b)=>a.live.actualStart-b.live.actualStart);
  groups.completed.sort((a,b)=>b.live.actualEnd-a.live.actualEnd);
  return groups;
}

export function selectActiveTicket(state,getLive){
  const tickets=(state.tickets||[]).filter(ticket=>ticket.kind!=='urban'&&ticket.status!=='cancelled');
  const selected=tickets.find(ticket=>ticket.id===state.activeTicketId);
  if(selected&&getLive(selected).status!=='completed')return selected;
  return tickets
    .map(ticket=>({ticket,live:getLive(ticket)}))
    .filter(entry=>!['completed','cancelled'].includes(entry.live.status))
    .sort((a,b)=>a.live.actualStart-b.live.actualStart)[0]?.ticket||null;
}

export function selectFavoriteStation(state,getStation){
  const counts={};
  (state.tickets||[]).forEach(ticket=>{
    if(ticket.fromId)counts[ticket.fromId]=(counts[ticket.fromId]||0)+1;
    if(ticket.toId)counts[ticket.toId]=(counts[ticket.toId]||0)+1;
  });
  const id=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||state.favorites?.[0];
  return getStation(id)||null;
}
