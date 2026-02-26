import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, BarChart3, Mail, Target, Users, Lightbulb, TrendingUp } from 'lucide-react'

const initialMessages = [
    {
        id: 1,
        type: 'ai',
        content: "Good morning! 👋 I've analyzed your CRM data overnight. Here's a quick summary:\n\n• **3 deals** are stalling in the Proposal stage\n• **Lisa Wang** from DataVault has opened your proposal **4 times** — high buying intent detected\n• Your team's **response time** improved by **18%** this week\n\nWould you like me to draft follow-up emails or dive deeper into any of these insights?"
    },
    {
        id: 2,
        type: 'user',
        content: "Tell me more about the stalling deals. Which ones should I prioritize?"
    },
    {
        id: 3,
        type: 'ai',
        content: "Here's my analysis of your 3 stalling deals, ranked by **urgency**:\n\n**1. PulseHQ — Dev Tools Bundle ($67,000)**\n• 6 days in Proposal stage (avg is 3.5 days)\n• Last contact was with **Marcus Brown** on Thursday\n• Risk: They're also evaluating a competitor\n• ✅ **Action:** Schedule a call today to address concerns\n\n**2. DataVault Inc — Analytics Platform ($42,000)**\n• 3 days in Proposal, but **Lisa Wang** is actively reviewing\n• Engagement score: **92/100** (very high)\n• ✅ **Action:** Send a personalized follow-up highlighting ROI data\n\n**3. CloudNova — Security Suite ($31,000)**\n• 2 days in Proposal stage\n• **Alex Rivera** hasn't opened the proposal yet\n• ✅ **Action:** Try a different outreach channel (phone call recommended)\n\n💡 Prioritizing PulseHQ first could protect **$67k** in pipeline value."
    },
]

// Smart response engine — matches user input to contextual CRM responses
const responsePatterns = [
    {
        keywords: ['pipeline', 'funnel', 'stages', 'pipeline analysis'],
        response: "📊 **Pipeline Analysis — February 2025**\n\nHere's your current pipeline breakdown:\n\n| Stage | Deals | Value | Avg Days |\n|-------|-------|-------|----------|\n| **Lead** | 3 | $115,000 | 3.0 days |\n| **Qualified** | 2 | $62,500 | 5.5 days |\n| **Proposal** | 3 | $140,000 | 3.7 days |\n| **Negotiation** | 2 | $123,000 | 3.0 days |\n| **Closed Won** | 2 | $136,000 | — |\n\n**Key Insights:**\n• 🟢 Pipeline is healthy with **$576,500** total value\n• ⚠️ **Qualified** stage has the longest avg cycle — consider faster qualification criteria\n• 🔥 **3 deals** in Proposal are worth **$140k** combined — focus energy here\n• 💡 Your weighted pipeline value is **$247k** (based on probability)\n\nWould you like me to suggest actions for any specific stage?"
    },
    {
        keywords: ['lead', 'score', 'scoring', 'prioritize', 'priority', 'leads'],
        response: "🎯 **AI Lead Scoring Report**\n\nI've analyzed all your leads based on **engagement, company fit, and buying signals**. Here are your top prospects:\n\n**🥇 Score: 94/100 — Lisa Wang (DataVault Inc)**\n• Opened proposal 4 times today\n• Company size: 200+ employees (ideal fit)\n• Budget: Confirmed $40k-50k range\n• ✅ **Hot Lead** — schedule a call ASAP\n\n**🥈 Score: 87/100 — Priya Patel (FlowState AI)**\n• Downloaded 3 case studies this week\n• Active on your pricing page 6 times\n• Co-founder with decision-making power\n• ✅ **Warm Lead** — send personalized demo offer\n\n**🥉 Score: 82/100 — Marcus Brown (PulseHQ)**\n• Long-standing relationship (4 deals history)\n• VP Engineering with team of 45 devs\n• Currently evaluating competitors\n• ✅ **At Risk** — competitive displacement possible\n\n**Lower Priority:**\n• Alex Rivera (CloudNova) — Score: 68 — hasn't engaged recently\n• Emma Thompson (NexGen) — Score: 41 — marked as inactive\n\n💡 **Recommendation:** Focus 70% effort on the top 3 leads this week."
    },
    {
        keywords: ['email', 'draft', 'write', 'follow-up', 'followup', 'message', 'outreach'],
        response: "✉️ **AI-Generated Follow-Up Emails**\n\nI've drafted personalized emails for your top 3 priority contacts:\n\n---\n\n**Email 1 — To: Marcus Brown (PulseHQ)**\n**Subject:** A quick win for your dev team, Marcus\n\nHi Marcus,\n\nI noticed your team has been scaling rapidly — congratulations! I wanted to share how **3 similar engineering teams** cut their deployment time by **40%** using our Dev Tools Bundle.\n\nWould 15 minutes work this Thursday to walk through some specific use cases?\n\n📊 **Email Score: 8.7/10** — High personalization\n\n---\n\n**Email 2 — To: Lisa Wang (DataVault Inc)**\n**Subject:** ROI breakdown you asked about, Lisa\n\nHi Lisa,\n\nFollowing up on the Analytics Platform proposal — I put together a custom **ROI projection** based on DataVault's current data volume.\n\n**Projected savings: $127,000/year** in operational efficiency.\n\nShall I walk you through the numbers?\n\n📊 **Email Score: 9.1/10** — Strong value proposition\n\n---\n\n**Email 3 — To: Alex Rivera (CloudNova)**\n**Subject:** Security trends your competitors are watching\n\nHi Alex,\n\nThought you'd find this interesting — **67% of SaaS companies** your size are upgrading their security stack this quarter. Our Security Suite directly addresses the top 3 compliance requirements.\n\nFree to chat for 10 minutes this week?\n\n📊 **Email Score: 7.9/10** — Could add more personalization\n\n---\n\nShall I send any of these, or would you like me to refine them?"
    },
    {
        keywords: ['revenue', 'forecast', 'predict', 'projection', 'earnings', 'money', 'sales'],
        response: "📈 **Revenue Forecast — Q1 2025**\n\nBased on your historical data and current pipeline, here's my prediction:\n\n**Monthly Forecast:**\n• **February (actual):** $72,000 ✅\n• **March (predicted):** $84,000 — $91,000\n• **April (predicted):** $96,000 — $108,000\n\n**Confidence: 78%** based on:\n✅ Strong pipeline ($576k total value)\n✅ Improving close rates (34% → projected 38%)\n⚠️ 3 deals at risk of slipping to next quarter\n\n**Revenue Breakdown by Source:**\n• 🟣 **New Business:** 55% ($39,600)\n• 🔵 **Expansions:** 28% ($20,160)\n• 🟢 **Renewals:** 17% ($12,240)\n\n**To hit $100k/month target:**\n1. Close **PulseHQ** ($67k) and **DataVault** ($42k) deals this month\n2. Move **2 qualified leads** to Proposal stage\n3. Increase outbound prospecting by **20%**\n\n💡 If you close the top 3 Proposal-stage deals, you'll exceed target by **$31k**.\n\nWant me to create a detailed action plan?"
    },
    {
        keywords: ['contact', 'contacts', 'who', 'customer', 'customers', 'client'],
        response: "👥 **Contact Intelligence Report**\n\nYou have **8 active contacts** in your CRM. Here's an engagement summary:\n\n**Most Engaged (last 7 days):**\n1. **Lisa Wang** (DataVault) — 12 interactions, proposal viewed 4x\n2. **Marcus Brown** (PulseHQ) — 8 interactions, attended demo\n3. **Priya Patel** (FlowState AI) — 6 interactions, downloaded resources\n\n**Needs Attention:**\n• **Alex Rivera** (CloudNova) — No activity in 5 days\n• **Emma Thompson** (NexGen) — Inactive for 2 weeks\n\n**Relationship Health:**\n• 🟢 Strong: 5 contacts (62.5%)\n• 🟡 Warm: 1 contact (12.5%)\n• 🔴 Cold: 2 contacts (25%)\n\n**Recommendations:**\n• Re-engage **Alex Rivera** with a phone call\n• Consider archiving **Emma Thompson** or reassigning to a different rep\n• **Sarah Chen** (Acme Corp) has 3 active deals — she's your champion\n\nWant me to draft re-engagement messages for cold contacts?"
    },
    {
        keywords: ['deal', 'deals', 'opportunity', 'close', 'win', 'negotiate'],
        response: "💼 **Deal Intelligence Summary**\n\nYou currently have **12 active deals** worth **$576,500** in total pipeline.\n\n**Deals Most Likely to Close This Month:**\n\n🟢 **Enterprise Onboarding — ByteScale ($54,000)**\n• Stage: Closed Won ✅\n• Probability: 100%\n• Status: Contract signed!\n\n🟢 **Annual Partnership — TechFlow ($95,000)**\n• Stage: Negotiation (80% probability)\n• Days left in stage: 2\n• ✅ Just needs final approval from CTO\n\n🟡 **Premium Support — Acme Corp ($28,000)**\n• Stage: Negotiation (75% probability)\n• Blocker: Pricing discussion ongoing\n• 💡 Consider a **10% discount** to accelerate close\n\n**At-Risk Deals:**\n⚠️ **Dev Tools Bundle — PulseHQ ($67,000)** — 6 days stalled\n⚠️ **AI Platform — FlowState ($52,000)** — Competitor threat\n\n**Win Rate This Quarter:** 34% (↑ from 28% last quarter)\n\nShall I suggest strategies for the at-risk deals?"
    },
    {
        keywords: ['help', 'what can you do', 'capabilities', 'features', 'how'],
        response: "🤖 **Here's what I can help you with:**\n\n**📊 Analytics & Insights**\n• Pipeline analysis with stage-by-stage breakdown\n• Revenue forecasting with confidence scores\n• Win/loss pattern recognition\n\n**🎯 Lead Management**\n• AI-powered lead scoring (0-100)\n• Engagement tracking and buying signals\n• Prioritization recommendations\n\n**✉️ Communication**\n• Draft personalized follow-up emails\n• Suggest optimal send times\n• Email scoring and improvement tips\n\n**💼 Deal Intelligence**\n• Deal risk alerts and stall detection\n• Competitive analysis\n• Next-best-action recommendations\n\n**👥 Contact Insights**\n• Relationship health monitoring\n• Engagement history analysis\n• Re-engagement strategies\n\n**📅 Productivity**\n• Meeting preparation briefs\n• Task prioritization\n• Weekly performance summaries\n\nTry asking me something like:\n• *\"Score my leads for this week\"*\n• *\"Draft an email for Marcus Brown\"*\n• *\"What's my revenue forecast?\"*\n• *\"Which deals are at risk?\"*"
    },
    {
        keywords: ['performance', 'team', 'metrics', 'kpi', 'stats', 'report'],
        response: "📋 **Weekly Performance Report**\n\n**Your Performance (Feb 19-26):**\n\n| Metric | This Week | Last Week | Change |\n|--------|-----------|-----------|--------|\n| Deals Closed | 2 | 1 | **+100%** 🟢 |\n| Revenue | $72,000 | $58,000 | **+24%** 🟢 |\n| Emails Sent | 34 | 28 | **+21%** 🟢 |\n| Response Time | 2.1 hrs | 2.6 hrs | **-19%** 🟢 |\n| Meetings | 8 | 6 | **+33%** 🟢 |\n| New Contacts | 5 | 3 | **+67%** 🟢 |\n\n**🎉 Great week!** All metrics are trending positively.\n\n**Top Achievement:** Closed **ByteScale Enterprise Onboarding** ($54k) — your largest single deal this month.\n\n**Areas for Improvement:**\n• Average deal cycle is **18 days** (target: 14 days)\n• 2 proposals haven't been followed up in 3+ days\n\n**Recommendation:** Block 30 minutes tomorrow for follow-ups — this alone could move **$109k** forward in your pipeline."
    },
    {
        keywords: ['meeting', 'call', 'schedule', 'calendar', 'prepare', 'prep'],
        response: "📅 **Meeting Intelligence**\n\n**Your Upcoming Meetings:**\n\n**Tomorrow, 10:00 AM — PulseHQ Demo Follow-up**\n👤 Marcus Brown (VP Engineering)\n📋 **Prep Notes:**\n• They're comparing us with CompetitorX — highlight our 2-week faster implementation\n• Marcus mentioned team size of 45 devs — use the enterprise pricing tier\n• Bring up the 30-day trial option\n• 🎯 Goal: Move deal from Proposal → Negotiation\n\n**Tomorrow, 2:00 PM — DataVault Inc Check-in**\n👤 Lisa Wang (Head of Ops)\n📋 **Prep Notes:**\n• She opened your proposal 4 times — she's very interested\n• Focus on the ROI projection ($127k annual savings)\n• She's the internal champion — ask about budget approval timeline\n• 🎯 Goal: Close the deal or get verbal commitment\n\n**Thursday, 11:00 AM — FlowState AI Discovery**\n👤 Priya Patel (Co-Founder)\n📋 **Prep Notes:**\n• First meeting — build rapport\n• AI company — emphasize our API integrations\n• Co-founder = decision maker — can move fast\n• 🎯 Goal: Qualify budget and timeline\n\nWant me to draft talking points for any of these?"
    },
    {
        keywords: ['competitor', 'competition', 'compare', 'alternative', 'vs'],
        response: "⚔️ **Competitive Intelligence Report**\n\nBased on deal notes and market data, here are the competitors appearing in your pipeline:\n\n**1. CompetitorX** — Appearing in **2 deals** (PulseHQ, FlowState)\n• Their pricing is ~15% lower\n• Weakness: Slower implementation (6 weeks vs our 2 weeks)\n• Weakness: No AI-powered features\n• **Win strategy:** Emphasize speed-to-value and AI capabilities\n\n**2. LegacyCRM** — Appearing in **1 deal** (CloudNova)\n• They have existing relationship\n• Weakness: Outdated UI, no mobile app\n• Weakness: $10k/year higher TCO over 3 years\n• **Win strategy:** Focus on modern experience + total cost of ownership\n\n**Your Win Rate vs Competitors:**\n• vs CompetitorX: **67%** win rate (4 of 6 deals)\n• vs LegacyCRM: **75%** win rate (3 of 4 deals)\n• No competition: **89%** win rate\n\n💡 **Key Differentiators to Highlight:**\n1. AI-powered insights (unique selling point)\n2. 2-week implementation guarantee\n3. 99.9% uptime SLA\n4. Dedicated customer success manager\n\nWant me to prepare battle cards for specific competitors?"
    },
]

function generateResponse(input) {
    const lower = input.toLowerCase()

    // Check each pattern for keyword matches
    let bestMatch = null
    let bestScore = 0

    for (const pattern of responsePatterns) {
        let score = 0
        for (const keyword of pattern.keywords) {
            if (lower.includes(keyword)) {
                score += keyword.length // longer keyword matches score higher
            }
        }
        if (score > bestScore) {
            bestScore = score
            bestMatch = pattern
        }
    }

    if (bestMatch && bestScore > 0) {
        return bestMatch.response
    }

    // Fallback: smart generic response based on user's message
    if (lower.includes('thank') || lower.includes('thanks') || lower.includes('great')) {
        return "You're welcome! 😊 I'm here whenever you need help. Here are some things I can assist with:\n\n• **\"Analyze my pipeline\"** — Full pipeline breakdown\n• **\"Score my leads\"** — AI-powered lead ranking\n• **\"Draft follow-up emails\"** — Personalized outreach\n• **\"Forecast revenue\"** — Predict upcoming earnings\n• **\"Prepare for meetings\"** — Meeting intel and prep notes\n\nJust ask away!"
    }

    if (lower.includes('yes') || lower.includes('sure') || lower.includes('ok') || lower.includes('do it') || lower.includes('go ahead')) {
        return "✅ Done! I've processed your request.\n\nHere's what I've set up:\n• 📧 **3 follow-up emails** queued for review\n• 📅 **2 meeting reminders** added to your calendar\n• 📊 Updated **deal risk scores** across your pipeline\n\nIs there anything else you'd like me to help with? You can ask about pipeline analysis, lead scoring, revenue forecasting, or anything else!"
    }

    if (lower.length < 10) {
        return "Could you tell me a bit more? I can help with:\n\n• 📊 **Pipeline analysis** — \"How's my pipeline looking?\"\n• 🎯 **Lead scoring** — \"Who should I follow up with?\"\n• ✉️ **Email drafting** — \"Write a follow-up for Lisa Wang\"\n• 📈 **Revenue forecast** — \"What's my projected revenue?\"\n• 💼 **Deal insights** — \"Which deals are at risk?\"\n\nThe more specific your question, the better insight I can provide!"
    }

    // Smart fallback
    return `Great question! Let me analyze that for you...\n\n🔍 **Analysis based on your CRM data:**\n\nLooking at your query about *"${input.substring(0, 60)}${input.length > 60 ? '...' : ''}"*, here's what I found:\n\n**Current State:**\n• Your pipeline has **$576k** in total value across **12 deals**\n• **5 contacts** are actively engaged this week\n• Win rate is trending up at **34%** (+6% from last quarter)\n\n**My Recommendations:**\n1. Focus on the **3 Proposal-stage deals** worth $140k — they're closest to closing\n2. Re-engage **2 cold contacts** before they churn\n3. Your **response time** (2.1 hrs) is excellent — keep it up!\n\nWant me to go deeper on any of these areas? Try asking specifically about:\n• **\"Lead scoring\"** for prospect prioritization\n• **\"Revenue forecast\"** for financial planning\n• **\"Draft emails\"** for automated outreach`
}

const suggestions = [
    { icon: BarChart3, color: '#8B5CF6', title: 'Pipeline Analysis', desc: 'Get AI-powered insights on your deals' },
    { icon: Mail, color: '#06B6D4', title: 'Draft Emails', desc: 'Auto-generate follow-up messages' },
    { icon: Target, color: '#10B981', title: 'Lead Scoring', desc: 'Prioritize your best prospects' },
    { icon: Users, color: '#F59E0B', title: 'Contact Insights', desc: 'Deep dive into contact behavior' },
    { icon: TrendingUp, color: '#F43F5E', title: 'Revenue Forecast', desc: 'Predict monthly revenue trends' },
    { icon: Lightbulb, color: '#6366F1', title: 'Smart Suggestions', desc: 'Get next-best-action recommendations' },
]

export default function AIAssistant() {
    const [messages, setMessages] = useState(initialMessages)
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSend = (text) => {
        const msg = text || inputValue
        if (!msg.trim()) return
        const userMsg = { id: Date.now(), type: 'user', content: msg }
        setMessages(prev => [...prev, userMsg])
        setInputValue('')
        setIsTyping(true)

        // Simulate AI "thinking" delay (800-2000ms based on response length)
        const response = generateResponse(msg)
        const delay = Math.min(800 + response.length * 2, 2500)

        setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'ai',
                content: response
            }])
        }, delay)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleSuggestionClick = (s) => {
        handleSend(s.title)
    }

    return (
        <div className="ai-chat-container animate-in">
            <div className="ai-chat-main">
                <div className="ai-chat-messages">
                    {messages.map(msg => (
                        <div key={msg.id} className={`chat-message ${msg.type === 'user' ? 'user' : ''}`}>
                            <div className={`chat-msg-avatar ${msg.type === 'ai' ? 'ai' : 'human'}`}>
                                {msg.type === 'ai' ? <Sparkles size={14} /> : 'LR'}
                            </div>
                            <div className="chat-msg-bubble">
                                {msg.content.split('\n').map((line, i) => {
                                    const parts = line.split(/(\*\*[^*]+\*\*)/g)
                                    return (
                                        <div key={i} style={{ minHeight: line === '' ? '8px' : 'auto' }}>
                                            {parts.map((part, j) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    return <strong key={j}>{part.slice(2, -2)}</strong>
                                                }
                                                if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
                                                    return <em key={j}>{part.slice(1, -1)}</em>
                                                }
                                                return <span key={j}>{part}</span>
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="chat-message">
                            <div className="chat-msg-avatar ai"><Sparkles size={14} /></div>
                            <div className="chat-msg-bubble">
                                <div className="typing-indicator">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="ai-chat-input-area">
                    <textarea
                        className="ai-chat-input"
                        placeholder="Ask me anything about your CRM..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <button className="ai-chat-send-btn" onClick={() => handleSend()}>
                        <Send />
                    </button>
                </div>
            </div>

            <div className="ai-chat-sidebar">
                <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 4 }}>Quick Prompts</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Click to get instant AI insights</p>
                </div>
                {suggestions.map((s, i) => (
                    <div
                        key={i}
                        className="ai-suggest-card"
                        onClick={() => handleSuggestionClick(s)}
                    >
                        <div className="ai-suggest-icon" style={{ background: s.color }}>
                            <s.icon />
                        </div>
                        <div className="ai-suggest-title">{s.title}</div>
                        <div className="ai-suggest-desc">{s.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
