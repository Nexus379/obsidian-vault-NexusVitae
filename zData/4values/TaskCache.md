<%-*
// Zeit-Matrix - Jetzt superschnell!
const logDate = dv.current().file.name.match(/\d{4}-\d{2}-\d{2}/)?.[0];
// Zugriff auf den Cache statt Scan des gesamten Vaults
const cachedTasks = dv.page("zData/TaskCache").file.tasks; 

let items = [];
cachedTasks.forEach(t => {
    // Regex für das Auslesen der Metadaten aus den Kommentaren im Cache
    const matchDue = t.text.match(/due:([\d-]+)/);
    const matchDo = t.text.match(/do:([\d-]+)/);
    const date = (matchDue ? matchDue[1] : (matchDo ? matchDo[1] : null));
    
    if (date && date.includes(logDate)) {
        items.push({ 
            link: dv.sectionLink(t.path, t.section.subpath, false, t.text), 
            time: date, 
            icon: "✅" 
        });
    }
});

const timedRows = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'].map(h => [
   `**${h}:00**`, 
   items.filter(i => i.time.includes('T' + h + ':')).map(i => `${i.icon} ${i.link}`).join('<br>')
]);

dv.table(['Time', 'Tasks'], timedRows);
-%>
