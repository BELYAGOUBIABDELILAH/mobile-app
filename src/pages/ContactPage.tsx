import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Code2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import ToastContainer from '@/components/ToastContainer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '', type: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, addToast } = useToastNotifications();

  const contactTypes = [
    t('contact', 'technicalSupport'),
    t('contact', 'generalQuestion'),
    t('contact', 'partnership'),
    t('contact', 'providerRegistration'),
    t('contact', 'report'),
    t('contact', 'other'),
  ];

  const contactInfo = [
    { icon: Phone, title: t('contact', 'phone'), details: t('contact', 'phoneNumber'), description: t('contact', 'phoneHours') },
    { icon: Mail, title: t('contact', 'emailLabel'), details: t('contact', 'emailAddress'), description: t('contact', 'emailResponse') },
    { icon: MapPin, title: t('contact', 'address'), details: t('contact', 'addressDetails'), description: t('contact', 'addressCity') },
    { icon: Clock, title: t('contact', 'hours'), details: t('contact', 'workingHours'), description: t('contact', 'saturdayHours') },
  ];

  const faqItems = [
    { question: t('contact', 'faq1Q'), answer: t('contact', 'faq1A') },
    { question: t('contact', 'faq2Q'), answer: t('contact', 'faq2A') },
    { question: t('contact', 'faq3Q'), answer: t('contact', 'faq3A') },
    { question: t('contact', 'faq4Q'), answer: t('contact', 'faq4A') },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast({ type: 'warning', title: t('contact', 'requiredFields'), message: t('contact', 'requiredFieldsDesc') });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast({ type: 'success', title: t('contact', 'messageSent'), message: t('contact', 'messageSentDesc') });
      setFormData({ name: '', email: '', subject: '', message: '', type: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-4">
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t('contact', 'title')}</h1>
          <p className="text-xs text-muted-foreground">{t('contact', 'subtitle')}</p>
        </div>
      </div>

      {/* Contact Form */}
      <Card className="bg-card border border-border rounded-xl shadow-sm mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Send className="h-4 w-4 text-primary" />
            {t('contact', 'sendMessage')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">{t('contact', 'fullName')} *</label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder={t('contact', 'fullName')} required className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">{t('contact', 'email')} *</label>
                <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="votre@email.com" required className="rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">{t('contact', 'requestType')}</label>
                <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}>
                  <SelectTrigger className="rounded-lg"><SelectValue placeholder={t('contact', 'choosePlaceholder')} /></SelectTrigger>
                  <SelectContent>
                    {contactTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">{t('contact', 'subject')}</label>
                <Input name="subject" value={formData.subject} onChange={handleInputChange} placeholder={t('contact', 'subjectPlaceholder')} className="rounded-lg" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">{t('contact', 'message')} *</label>
              <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder={t('contact', 'messagePlaceholder')} rows={4} required className="rounded-lg" />
            </div>

            <Button type="submit" className="w-full rounded-lg" disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner size="sm" /> : <><Send className="mr-2 h-4 w-4" />{t('contact', 'send')}</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="bg-card border border-border rounded-xl shadow-sm mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('contact', 'contactInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contactInfo.map((info, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <info.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{info.title}</h4>
                <p className="text-xs text-foreground">{info.details}</p>
                <p className="text-[11px] text-muted-foreground">{info.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="bg-card border border-border rounded-xl shadow-sm mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('contact', 'faq')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {faqItems.map((item, i) => (
            <div key={i} className="space-y-1">
              <h4 className="text-sm font-medium">{item.question}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.answer}</p>
              {i < faqItems.length - 1 && <hr className="border-border/50" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emergency */}
      <Card className="bg-card border border-destructive/20 rounded-xl shadow-sm mb-4">
        <CardContent className="p-4 text-center">
          <Phone className="mx-auto mb-2 text-destructive" size={20} />
          <h4 className="text-sm font-medium text-destructive mb-1">{t('contact', 'emergencyTitle')}</h4>
          <p className="text-xs text-muted-foreground mb-3">{t('contact', 'emergencyDesc')}</p>
          <Button variant="destructive" className="w-full rounded-lg" size="sm">
            <Phone className="mr-2 h-3 w-3" /> {t('contact', 'callEmergency')}
          </Button>
        </CardContent>
      </Card>

      {/* Team */}
      <div className="mb-4">
        <h2 className="text-base font-bold mb-3 text-center">{t('contact', 'teamTitle')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Naimi Abdeldjalil', role: t('contact', 'coFounderDev'), icon: Code2 },
            { name: 'Belyagoubi Abdelilah', role: t('contact', 'coFounderCTO'), icon: Shield },
          ].map((member, i) => (
            <Card key={i} className="bg-card border border-border rounded-xl shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <member.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xs font-bold">{member.name}</h3>
                <span className="inline-flex mt-1 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium">
                  {member.role}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
