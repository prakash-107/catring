import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FileText, Download, Calendar as CalendarIcon, Printer, CheckCircle } from 'lucide-react';

const Reports = () => {
    const [reportType, setReportType] = useState('daily');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [month, setMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            let params = { type: reportType };
            if (reportType === 'daily') params.date = date;
            else if (reportType === 'monthly') params.date = month;
            else if (reportType === 'weekly') {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const res = await axios.get('http://localhost:5000/api/reports', { params });
            const data = res.data;

            const doc = new jsPDF();
            const title = `Sree Gajananan Catering - ${reportType.toUpperCase()} REPORT`;
            const subTitle = reportType === 'daily' ? `Date: ${date}` : reportType === 'monthly' ? `Month: ${month}` : `Period: ${startDate} to ${endDate}`;

            doc.setFontSize(18);
            doc.setTextColor(212, 175, 55);
            doc.text(title, 14, 20);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(subTitle, 14, 28);

            // --- Events Table ---
            if (data.events.length > 0) {
                doc.text("EVENTS", 14, 38);
                doc.autoTable({
                    startY: 42,
                    head: [['Date', 'Client', 'Location', 'Time']],
                    body: data.events.map(e => [new Date(e.date).toLocaleDateString(), e.clientName, e.location, e.deliveryTime]),
                    theme: 'grid',
                    headStyles: { fillColor: [62, 39, 35] }
                });
            }

            // --- Income Table ---
            const incomeY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 42;
            if (data.income.length > 0) {
                doc.text("INCOME (VARAVU)", 14, incomeY);
                doc.autoTable({
                    startY: incomeY + 4,
                    head: [['Date', 'Client', 'Source', 'Total', 'Paid', 'Balance']],
                    body: data.income.map(i => [
                        new Date(i.date).toLocaleDateString(), 
                        i.clientName, 
                        i.source, 
                        `Rs.${i.totalAmount}`, 
                        `Rs.${i.paidAmount}`, 
                        `Rs.${i.totalAmount - i.paidAmount}`
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [76, 175, 80] }
                });
            }

            // --- Expenses Table ---
            const expenseY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 42;
            if (data.expenses.length > 0) {
                doc.text("EXPENSES (SELAVU)", 14, expenseY);
                doc.autoTable({
                    startY: expenseY + 4,
                    head: [['Date', 'Expense Name', 'Source', 'Amount']],
                    body: data.expenses.map(exp => [
                        new Date(exp.date).toLocaleDateString(), 
                        exp.expenseName, 
                        exp.source, 
                        `Rs.${exp.amount}`
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [244, 67, 54] }
                });
            }

            // --- Salaries Table ---
            const salaryY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 42;
            if (data.salaries.length > 0) {
                doc.text("STAFF SALARY payments", 14, salaryY);
                doc.autoTable({
                    startY: salaryY + 4,
                    head: [['Date', 'Staff Name', 'Amount']],
                    body: data.salaries.map(s => [
                        new Date(s.date).toLocaleDateString(), 
                        s.staffName, 
                        `Rs.${s.amount}`
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [33, 150, 243] }
                });
            }

            // --- Summary ---
            const summaryY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 42;
            const totalIncome = data.income.reduce((sum, i) => sum + i.paidAmount, 0);
            const totalExpense = data.expenses.reduce((sum, e) => sum + e.amount, 0);
            const totalSalary = data.salaries.reduce((sum, s) => sum + s.amount, 0);
            const netProfit = totalIncome - (totalExpense + totalSalary);

            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text("Financial Summary", 14, summaryY);
            doc.setFontSize(10);
            doc.text(`Total Income Received: Rs.${totalIncome}`, 14, summaryY + 8);
            doc.text(`Total Expenses: Rs.${totalExpense}`, 14, summaryY + 14);
            doc.text(`Total Salaries Paid: Rs.${totalSalary}`, 14, summaryY + 20);
            if (netProfit >= 0) {
                doc.setTextColor(76, 175, 80);
            } else {
                doc.setTextColor(244, 67, 54);
            }
            doc.setFontSize(12);
            doc.text(`Net Cash Flow: Rs.${netProfit}`, 14, summaryY + 30);

            doc.save(`Sree_Gajananan_Report_${reportType}_${new Date().getTime()}.pdf`);
        } catch (err) {
            console.error(err);
            alert("Error generating report");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="reports-page">
            <header className="mb-2">
                <h1 className="text-gold">Report Center</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Generate and export business analysis reports to PDF</p>
            </header>

            <div className="glass-card" style={{ maxWidth: '600px', margin: '2rem 0' }}>
                <h3 className="mb-2 flex-between" style={{ color: 'var(--primary)' }}>
                    Export Data <Printer size={20} />
                </h3>

                <div className="form-group mb-2">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select Report Type</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['daily', 'weekly', 'monthly'].map(t => (
                            <button 
                                key={t}
                                className={`btn ${reportType === t ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setReportType(t)}
                                style={{ flex: 1, textTransform: 'capitalize' }}
                            >{t}</button>
                        ))}
                    </div>
                </div>

                <div className="form-group mb-2">
                    {reportType === 'daily' && (
                        <>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </>
                    )}
                    {reportType === 'monthly' && (
                        <>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select Month</label>
                            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                        </>
                    )}
                    {reportType === 'weekly' && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Start Date</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>End Date</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
                    onClick={generatePDF}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating...' : <><Download size={20} /> Download PDF Report</>}
                </button>
            </div>

            <div className="glass-card" style={{ maxWidth: '600px' }}>
                <h4 className="flex-between mb-2">
                    Instructions <CheckCircle size={18} className="text-gold" />
                </h4>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Daily reports include all transactions for a specific day.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Weekly reports allow you to select a custom range.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Monthly reports aggregate data for the entire selected month.</li>
                    <li>Reports include Events, Income (Varavu), Expenses (Selavu), and Staff Salaries.</li>
                </ul>
            </div>
        </div>
    );
};

export default Reports;
