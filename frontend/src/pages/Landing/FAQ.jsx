import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: "How does the AI map nodes and connections?",
      a: "Our background semantic parser automatically processes the text content of your notes and documents. It extracts entities (such as projects, dates, custom labels, and people) and calculates semantic proximity to build logical links between new and existing nodes in your personal database."
    },
    {
      q: "Is my data secure and private?",
      a: "Yes, privacy is our top priority. All database logs are encrypted in transit and at rest. We do not use your personal knowledge graph data to train public models, ensuring your notes and thoughts remain entirely private."
    },
    {
      q: "Can I import documents from other platforms?",
      a: "Absolutely. KnowledgeGraph AI supports uploading PDFs, markdown drafts, text documents, and web bookmarks. Our ingestion engine quickly structures these documents into accessible nodes."
    },
    {
      q: "Is there a limit on the number of nodes I can ingest?",
      a: "Our standard plan supports up to 10,000 nodes and 50,000 connections with real-time graph visualization. For larger knowledge bases, our enterprise plan offers unlimited scaling."
    },
    {
      q: "Can I manually adjust or delete suggested connections?",
      a: "Yes. While the AI highlights suggested relationships in the background, you retain complete authority over your map. You can manually delete any automated connections or link custom nodes directly on the graph workspace."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="light-section" style={{ padding: '6rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="text-label" style={{ color: 'var(--accent-indigo)', marginBottom: '1rem', display: 'inline-block', textShadow: 'none' }}>Questions</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Frequently Asked <span className="accent-highlight">Questions.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: '0 auto', lineHeight: 1.65 }}>
            Everything you need to know about setting up and running your personal knowledge database.
          </p>
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;

            return (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    backgroundColor: isOpen ? 'rgba(79, 70, 229, 0.02)' : 'transparent',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      fontSize: '0.9rem',
                      color: isOpen ? 'var(--accent-indigo)' : 'var(--text-muted)',
                      fontWeight: 800,
                    }}
                  >
                    ▼
                  </motion.span>
                </button>

                {/* Accordion Panel Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div
                        style={{
                          padding: '0 1.5rem 1.5rem 1.5rem',
                          color: 'var(--text-secondary)',
                          fontSize: '0.925rem',
                          lineHeight: 1.65,
                          borderTop: '1px solid rgba(15, 23, 42, 0.03)',
                        }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
