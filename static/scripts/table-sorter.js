function setTableSort() {
    const getCellValue = (tr, index) => {
        return tr.children[index].innerText || tr.children[index].textContent;
    }

    const comparer = (idx, asc) => (rowa, rowb) => ((txta, txtb) => {
            if (txta.slice(-1) == "%" && txtb.slice(-1) == "%") txta = txta.slice(0, -1), txtb = txtb.slice(0, -1);
            return txta !== '' && txtb !== '' && !isNaN(txta) && !isNaN(txtb) ? txta - txtb : txta.toString().localeCompare(txtb);
        })(getCellValue(asc ? rowa : rowb, idx), getCellValue(asc ? rowb : rowa, idx))

    const arrow = (order) => order ? "&#x1f809;" : "&#x1f80b;"
        
    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr) );
        Array.from(th.parentNode.children).forEach(head => {
            const headtext = head.innerHTML.replace(/([\w ]+).+/, "$1");
            head.innerHTML = `${headtext}${head == th ? arrow(this.order = !this.order) : "-"}`;
        });
    })));
};