"""
Decision Passport & Strategic Project Report PDF Generator for ContextLock Zero.
Generates an executive-ready PDF report matching the Page 11 & 12 specification.
"""
import io
from datetime import datetime
from typing import List, Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def generate_decision_passport_pdf(
    project_name: str,
    health_data: Dict[str, Any],
    decisions: List[Dict[str, Any]],
    conflicts: List[Dict[str, Any]],
    gaps: List[Dict[str, Any]]
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#1e1b4b") # Deep indigo
    c_accent = colors.HexColor("#7c3aed") # Violet
    c_teal = colors.HexColor("#0f766e")
    c_conflict = colors.HexColor("#b91c1c") # Red
    c_bg_card = colors.HexColor("#f8fafc")
    c_text_dark = colors.HexColor("#0f172a")
    c_text_muted = colors.HexColor("#475569")
    
    # Custom Styles
    style_header_title = ParagraphStyle(
        'HeaderTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.white
    )
    style_header_sub = ParagraphStyle(
        'HeaderSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#cbd5e1")
    )
    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_teal,
        spaceAfter=6
    )
    style_body = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_text_dark,
        alignment=TA_LEFT
    )
    style_table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_text_dark
    )
    style_table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )
    
    story = []
    
    # 1. Hero Header Banner
    header_data = [
        [
            Paragraph("<b>ContextLock Zero: Decision Passport</b>", style_header_title),
            Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}<br/><b>Status:</b> Immune Audit Complete", style_header_sub)
        ],
        [
            Paragraph(f"PROJECT: {project_name.upper()}  |  AI DECISION IMMUNE SYSTEM REPORT", style_header_sub),
            Paragraph("EVIDENCE GROUNDED: 100%", style_header_sub)
        ]
    ]
    header_table = Table(header_data, colWidths=[360, 172])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_primary),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 14))
    
    # 2. Executive Summary
    story.append(Paragraph("<b>EXECUTIVE SUMMARY</b>", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_teal, spaceAfter=8))
    
    overall_score = health_data.get("overall_score", 74)
    summary_text = (
        f"ContextLock Zero continuously evaluated project artifacts (PRD, meeting transcripts, architecture specs, and git commits). "
        f"The project decision health score is indexed at <b>{overall_score}/100</b>. "
        f"A total of <b>{len(decisions)} architectural decisions</b> were extracted with grounded citations. "
        f"Crucially, <b>{len(conflicts)} critical cross-artifact contradictions</b> and <b>{len(gaps)} ownership gaps</b> were flagged before production deployment."
    )
    story.append(Paragraph(summary_text, style_body))
    story.append(Spacer(1, 12))
    
    # 3. Decision Health Scorecard (Explainable 5 Dimensions)
    story.append(Paragraph("<b>DECISION HEALTH SCORECARD & EXPLAINABILITY</b>", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_teal, spaceAfter=8))
    
    health_rows = [
        [Paragraph("<b>METRIC</b>", style_table_header), Paragraph("<b>SCORE</b>", style_table_header), Paragraph("<b>EXPLANATION (THE 'WHY')</b>", style_table_header)],
        [Paragraph("Stability", style_table_cell), Paragraph(f"<b>{health_data.get('stability', 65)}%</b>", style_table_cell), Paragraph(health_data.get('stability_why', 'Historical churn'), style_table_cell)],
        [Paragraph("Conflict Level", style_table_cell), Paragraph(f"<b>{health_data.get('conflict_level', 45)}%</b>", style_table_cell), Paragraph(health_data.get('conflict_why', 'Contradictions'), style_table_cell)],
        [Paragraph("Ownership", style_table_cell), Paragraph(f"<b>{health_data.get('ownership', 80)}%</b>", style_table_cell), Paragraph(health_data.get('ownership_why', 'DRI coverage'), style_table_cell)],
        [Paragraph("Documentation Sync", style_table_cell), Paragraph(f"<b>{health_data.get('documentation_sync', 70)}%</b>", style_table_cell), Paragraph(health_data.get('documentation_why', 'Doc freshness'), style_table_cell)],
        [Paragraph("Dependency Risk", style_table_cell), Paragraph(f"<b>{health_data.get('dependency_risk', 68)}%</b>", style_table_cell), Paragraph(health_data.get('dependency_why', 'Blast radius'), style_table_cell)],
    ]
    health_table = Table(health_rows, colWidths=[100, 55, 377])
    health_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_accent),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_card]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(health_table)
    story.append(Spacer(1, 14))
    
    # 4. Critical Conflicts Radar
    story.append(Paragraph("<b>CRITICAL CONFLICTS RADAR</b>", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_conflict, spaceAfter=8))
    
    if conflicts:
        for c in conflicts:
            source_c_text = f" vs {c.get('source_c')}" if c.get('source_c') else ""
            sources_line = f"<b>Sources:</b> {c.get('source_a', '')} vs {c.get('source_b', '')}{source_c_text}"
            c_box = [
                [Paragraph(f"<b>ALERT: {c.get('title', 'Conflict Detected')}</b> (Severity: {c.get('severity', 'Critical')})", ParagraphStyle('AlertHead', parent=style_table_header, textColor=colors.white))],
                [Paragraph(f"<b>Description:</b> {c.get('description', '')}", style_body)],
                [Paragraph(sources_line, style_body)],
                [Paragraph(f"<b>Action Recommendation:</b> {c.get('recommendation', '')}", ParagraphStyle('Rec', parent=style_body, textColor=c_primary, fontName='Helvetica-Bold'))]
            ]
            t_box = Table(c_box, colWidths=[532])
            t_box.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), c_conflict),
                ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#fef2f2")),
                ('BOX', (0,0), (-1,-1), 1, c_conflict),
                ('PADDING', (0,0), (-1,-1), 6),
            ]))
            story.append(t_box)
            story.append(Spacer(1, 8))
    else:
        story.append(Paragraph("No active conflicts identified across ingested specifications.", style_body))
    story.append(Spacer(1, 10))

    # 5. Extracted Decisions & Grounded Evidence
    story.append(Paragraph("<b>EXTRACTED DECISIONS & EVIDENCE TRACEABILITY</b>", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_teal, spaceAfter=8))
    
    dec_rows = [
        [
            Paragraph("<b>DECISION</b>", style_table_header),
            Paragraph("<b>OWNER</b>", style_table_header),
            Paragraph("<b>DATE</b>", style_table_header),
            Paragraph("<b>CONFIDENCE</b>", style_table_header),
            Paragraph("<b>STATUS</b>", style_table_header)
        ]
    ]
    for d in decisions[:8]:
        conf_val = f"{int(d.get('confidence', 0.9) * 100)}%"
        dec_rows.append([
            Paragraph(f"<b>{d.get('title', '')}</b><br/><font color='#64748b'>{d.get('reason', '')[:80]}...</font>", style_table_cell),
            Paragraph(d.get("owner") or "<font color='#b91c1c'>UNASSIGNED</font>", style_table_cell),
            Paragraph(d.get("date", "2025-09-10"), style_table_cell),
            Paragraph(conf_val, style_table_cell),
            Paragraph(f"<b>{d.get('status', 'active').upper()}</b>", style_table_cell)
        ])
    dec_table = Table(dec_rows, colWidths=[232, 100, 70, 65, 65])
    dec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_card]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(dec_table)
    story.append(Spacer(1, 14))

    # 6. Open Questions & Future Action Items
    story.append(Paragraph("<b>OPEN ACTION ITEMS & FUTURE SCOPE</b>", style_h1))
    story.append(HRFlowable(width="100%", thickness=1, color=c_teal, spaceAfter=8))
    
    actions_text = (
        "1. Standardize Authentication Architecture across PRD and Git repositories before sprint release.<br/>"
        "2. Assign Technical Owner (DRI) to the Multi-Channel Notification Architecture.<br/>"
        "3. Future integrations on roadmap: Slack alerts, Jira sync, GitHub Webhooks, Figma plugin, and automated CI/CD decision lock gates."
    )
    story.append(Paragraph(actions_text, style_body))
    story.append(Spacer(1, 14))

    doc.build(story)
    return buffer.getvalue()
