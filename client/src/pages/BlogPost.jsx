import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen, ChevronDown, Tag } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import MaxWidthContainer from '../components/ui/MaxWidthContainer';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import SEOHead from '../components/seo/SEOHead';
import { PAGE_SEO } from '../config/seo';
import { BLOG_POSTS, getBlogPostBySlug } from '../data/blogContent';

// ─── Category color map ───────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  'Company Registration': '#1D4ED8',
  'GST': '#2563EB',
  'Trademark': '#0F172A',
  'Income Tax': '#1D4ED8',
  'MSME Registration': '#10B981',
  'Startup Compliance': '#0F172A',
};

// ─── Blog Listing Page (/blog) ────────────────────────────────────────────────
export const BlogListing = () => (
  <PageContainer animate>
    <SEOHead
      title={PAGE_SEO.blog.title}
      description={PAGE_SEO.blog.description}
      canonical={PAGE_SEO.blog.canonical}
    />
    <div className="relative bg-brand-secondary text-white py-20 md:py-28 border-b border-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-brand-primary/15 via-transparent to-transparent pointer-events-none" />
      <MaxWidthContainer size="lg" className="relative z-10 text-center space-y-5">
        <Badge variant="light" className="bg-brand-primary/20 text-brand-primary border-brand-primary/30 font-bold tracking-wider">
          <BookOpen className="w-3 h-3 mr-1.5 inline" />Insights & Updates
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
          ClearFiling Blog
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto text-base font-sans leading-relaxed">
          Expert articles on business registration, taxation, compliance, and legal advisory — curated by our CA and CS professionals.
        </p>
      </MaxWidthContainer>
    </div>

    <div className="bg-white py-16 md:py-20">
      <MaxWidthContainer size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, idx) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <Card isHoverable className="h-full flex flex-col overflow-hidden">
                  {/* Cover bar */}
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: CATEGORY_COLORS[post.category] || '#1D4ED8' }}
                  />
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <Badge variant="light" className="text-[10px] font-bold w-fit">{post.category}</Badge>
                    <h2 className="text-sm font-extrabold font-heading text-brand-secondary group-hover:text-brand-primary transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.publishedDate}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-brand-primary font-bold group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </MaxWidthContainer>
    </div>
  </PageContainer>
);

// ─── Individual Blog Post (/blog/:slug) ───────────────────────────────────────
const BlogPost = () => {
  const { slug } = useParams();
  const [openFaq, setOpenFaq] = React.useState(null);
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <PageContainer animate>
        <SEOHead
          title="Article Not Found | ClearFiling"
          description="The requested blog article could not be found."
          canonical="https://www.clearfiling.co.in/blog"
        />
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-24 text-center">
          <h1 className="text-3xl font-extrabold font-heading text-brand-secondary mb-4">Article Not Found</h1>
          <p className="text-slate-500 mb-8 font-sans">This article may have been moved or is not yet published.</p>
          <Link to="/blog" className="text-brand-primary font-bold hover:underline flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />Back to Blog
          </Link>
        </div>
      </PageContainer>
    );
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ClearFiling, I read your article on "${post.title}" and would like a free consultation.`);
    window.open(`https://wa.me/919250201718?text=${text}`, '_blank');
  };

  const relatedPosts = BLOG_POSTS.filter(p => post.relatedPosts?.includes(p.slug)).slice(0, 3);

  return (
    <PageContainer animate>
      {/* Route-level SEO Metadata */}
      <SEOHead
        title={`${post.title} | ClearFiling Blog`}
        description={post.excerpt || 'Read the full business compliance article on ClearFiling Blog.'}
        canonical={`https://www.clearfiling.co.in/blog/${post.slug}`}
        ogType="article"
      />

      {/* Hero */}
      <div
        className="relative text-white py-20 md:py-28 border-b border-slate-800 overflow-hidden"
        style={{ backgroundColor: post.coverColor || '#0F172A' }}
      >
        <div className="absolute inset-0 bg-radial-gradient from-white/5 via-transparent to-transparent pointer-events-none" />
        <MaxWidthContainer size="lg" className="relative z-10 space-y-5">
          <Badge variant="light" className="bg-white/15 text-white border-white/20 font-bold tracking-wider">
            {post.category}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight max-w-3xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/70 flex-wrap">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.publishedDate}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
            <span className="text-white/50">|</span>
            <span>By {post.author}</span>
          </div>
        </MaxWidthContainer>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100">
        <MaxWidthContainer size="lg" className="py-3">
          <Breadcrumbs items={[{ label: 'Blog', to: '/blog' }, { label: post.title }]} />
        </MaxWidthContainer>
      </div>

      {/* Content */}
      <div className="bg-white py-14 md:py-20">
        <MaxWidthContainer size="lg" className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Article */}
          <article className="lg:col-span-8 space-y-8">
            {post.sections && post.sections.map((section, idx) => {
              if (section.heading === 'FAQs') return null; // FAQs rendered separately
              return (
                <div key={idx} className="space-y-3">
                  <h2 className="text-xl font-extrabold font-heading text-brand-secondary">{section.heading}</h2>
                  <div className="text-sm text-slate-600 font-sans leading-relaxed space-y-2.5">
                    {Array.isArray(section.content)
                      ? section.content.map((item, i) =>
                          typeof item === 'string'
                            ? <p key={i}>{item}</p>
                            : <ul key={i} className="list-disc pl-5 space-y-1.5">{item.map((li, j) => <li key={j}>{li}</li>)}</ul>
                        )
                      : <p>{section.content}</p>
                    }
                  </div>
                </div>
              );
            })}

            {/* FAQs */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="text-xl font-extrabold font-heading text-brand-secondary">Frequently Asked Questions</h2>
                <div className="space-y-2.5">
                  {post.faqs.map((faq, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200/70 rounded-xl overflow-hidden">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full text-left flex justify-between items-center gap-4 p-4 text-sm font-semibold text-brand-secondary">
                        {faq.q}
                        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180 text-brand-primary' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                            transition={{ duration: 0.2 }} className="overflow-hidden border-t border-slate-100">
                            <div className="p-4 text-xs text-slate-500 font-sans leading-relaxed">{faq.a}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Article CTA */}
            {post.cta && (
              <div className="bg-brand-bg border border-brand-primary/10 rounded-2xl p-6 text-center space-y-4">
                <h3 className="text-base font-extrabold font-heading text-brand-secondary">Ready to get started?</h3>
                <button onClick={handleWhatsApp}
                  className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-primary/90 transition-colors">
                  <ArrowRight className="w-4 h-4" />{post.cta.text}
                </button>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="p-6 bg-brand-secondary text-white rounded-2xl space-y-4 border-0">
              <h3 className="text-base font-extrabold font-heading">Free Expert Consultation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Speak with a senior CA or CS advisor about your specific compliance requirements.</p>
              <button onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white rounded-xl py-3 text-xs font-bold hover:bg-brand-primary/90 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />Request Consultation
              </button>
              <a href="tel:+919250201718" className="flex items-center justify-center text-xs text-slate-300 hover:text-white transition-colors">
                Or call +91 9250201718
              </a>
            </Card>

            {relatedPosts.length > 0 && (
              <Card className="p-6 space-y-4 rounded-2xl">
                <h3 className="text-sm font-extrabold font-heading text-brand-secondary">Related Articles</h3>
                <div className="space-y-3">
                  {relatedPosts.map(p => (
                    <Link key={p.slug} to={`/blog/${p.slug}`}
                      className="flex items-start gap-2 text-xs text-slate-600 hover:text-brand-primary transition-colors group">
                      <ArrowRight className="w-3 h-3 text-brand-primary mt-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="leading-snug">{p.title}</span>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6 space-y-4 rounded-2xl">
              <h3 className="text-sm font-extrabold font-heading text-brand-secondary">Quick Links</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'All Services', to: '/services' },
                  { label: 'Resource Guides', to: '/resources' },
                  { label: 'Contact Us', to: '/contact' },
                ].map(l => (
                  <Link key={l.label} to={l.to}
                    className="flex items-center gap-2 text-xs text-brand-primary hover:text-brand-accent transition-colors group">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />{l.label}
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </MaxWidthContainer>
      </div>
    </PageContainer>
  );
};

export default BlogPost;
