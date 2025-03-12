import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Award, 
  Shield, 
  CheckCircle2,
  ArrowLeft,
  Star,
  CarFront,
  FileText,
  Bot,
  MessageSquare,
  BarChart,
  Check,
  Users,
  ChevronDown,
  Menu,
  X,
  Search,
  Newspaper,
  Calendar,
  Zap,
  Landmark,
  AlertCircle,
  ThumbsUp,
  DollarSign,
  BadgeCheck,
  BookOpen,
  ArrowRight,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  ExternalLink,
  ChevronUp,
  BarChart3,
  PieChart,
  TrendingUp,
  Lightbulb,
  FileQuestion,
  Scale,
  Clipboard,
  Share2,
  Timer,
  Percent,
  Maximize,
  HelpCircle,
  Heart,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import BlogCard from "../components/landing/BlogCard";
import CaseStudyCard from "../components/landing/CaseStudyCard";
import StatCounter from "../components/landing/StatCounter";
import TestimonialCard from "../components/landing/TestimonialCard";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/api/entities";

export default function Landing() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [count, setCount] = useState({ users: 0, appeals: 0, success: 0, savings: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [contactFormLoading, setContactFormLoading] = useState(false);
  const [language, setLanguage] = useState('he'); // Default to Hebrew
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });
  const navigate = useNavigate();
  const blogRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    // Load user language preference
    const loadLanguagePreference = async () => {
      try {
        const user = await User.me();
        if (user.language_preference) {
          setLanguage(user.language_preference);
        } else {
          const storedLang = localStorage.getItem('languagePreference');
          if (storedLang) {
            setLanguage(storedLang);
          }
        }
      } catch (error) {
        // User not logged in, check localStorage
        const storedLang = localStorage.getItem('languagePreference');
        if (storedLang) {
          setLanguage(storedLang);
        }
      }
    };
    
    loadLanguagePreference();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const newUsers = prev.users < 2500 ? prev.users + 25 : 2500;
        const newAppeals = prev.appeals < 5800 ? prev.appeals + 50 : 5800;
        const newSuccess = prev.success < 92 ? prev.success + 1 : 92;
        const newSavings = prev.savings < 2500000 ? prev.savings + 25000 : 2500000;
        
        if (newUsers === 2500 && newAppeals === 5800 && newSuccess === 92 && newSavings === 2500000) {
          clearInterval(interval);
        }
        
        return { users: newUsers, appeals: newAppeals, success: newSuccess, savings: newSavings };
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        // Use hardcoded blog posts based on language
        if (language === 'en') {
          const englishPosts = [
            {
              id: 1,
              title: "How to Deal with an Unjustified Parking Ticket - The Complete Guide",
              summary: "A parking ticket may be justified, but in many cases, the authorities make mistakes. In this article, we provide a detailed guide on how to deal with unjustified parking tickets and how to file an effective appeal.",
              category: "Guides",
              publishDate: "10.11.2023",
              readTime: "6 min",
              author: "Adv. Rachel Lewis",
              authorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 2,
              title: "5 Valid Reasons to Appeal a Parking Ticket You Should Know",
              summary: "There are several valid reasons for appealing a parking ticket that often lead to a full cancellation of the fine. In this article, we'll review the 5 most common reasons every driver should know.",
              category: "Tips",
              publishDate: "01.12.2023",
              readTime: "4 min",
              author: "Alan Cohen",
              authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 3,
              title: "What the Law Says About Parking Tickets and How It Affects Your Appeal",
              summary: "Understanding the legal framework of parking tickets can greatly assist in submitting a successful appeal. In this article, we'll review the relevant laws and regulations and your rights as drivers.",
              category: "Legal",
              publishDate: "15.12.2023",
              readTime: "7 min",
              author: "Adv. David Levinson",
              authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 4,
              title: "How Artificial Intelligence is Changing the World of Ticket Appeals",
              summary: "Advanced technologies like artificial intelligence are changing the way appeals are filed for tickets. Discover how AI can significantly improve the chances of success for your appeal.",
              category: "Technology",
              publishDate: "22.12.2023",
              readTime: "5 min",
              author: "Michelle Abraham",
              authorImage: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 5,
              title: "Case Study: How We Cancelled a $250 Ticket for a Client",
              summary: "A detailed analysis of a real case where we helped a client cancel a significant parking ticket. In this article, we'll reveal the strategy that led to success and the main lessons.",
              category: "Case Studies",
              publishDate: "05.01.2024",
              readTime: "8 min",
              author: "Gil Steinberg",
              authorImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1586791965591-15d8892f4333?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 6,
              title: "Surprising Statistics: 78% of Parking Ticket Appeals are Accepted",
              summary: "New research reveals that most appeals submitted for parking tickets are accepted, but most drivers don't appeal at all. In this article, we'll present the surprising data and what it means for you.",
              category: "Statistics",
              publishDate: "18.01.2024",
              readTime: "4 min",
              author: "Dr. Ronald Cohen",
              authorImage: "https://images.unsplash.com/photo-1584999734482-0361aecad844?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1423592707957-3b212afa6733?auto=format&fit=crop&q=80&w=600"
            }
          ];
          setBlogPosts(englishPosts);
        } else {
          // Hebrew blog posts
          const hebrewPosts = [
            {
              id: 1,
              title: "איך להתמודד עם דוח חניה לא מוצדק - המדריך המלא",
              summary: "דוח חניה יכול להיות מוצדק, אך במקרים רבים הרשויות טועות. במאמר זה נספק מדריך מפורט כיצד להתמודד עם דוחות חניה בלתי מוצדקים וכיצד להגיש ערעור אפקטיבי.",
              category: "מדריכים",
              publishDate: "10.11.2023",
              readTime: "6 דקות",
              author: "עו״ד רונית לוי",
              authorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 2,
              title: "5 סיבות מוצדקות לערעור על דוח חניה שכדאי להכיר",
              summary: "ישנן מספר סיבות מוצדקות לערעור על דוח חניה אשר במקרים רבים מובילות לביטול מלא של הקנס. במאמר זה נסקור את 5 הסיבות הנפוצות ביותר שכדאי לכל נהג להכיר.",
              category: "טיפים",
              publishDate: "01.12.2023",
              readTime: "4 דקות",
              author: "אלון כהן",
              authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 3,
              title: "מה אומר החוק על דוחות חניה וכיצד זה משפיע על הערעור שלכם",
              summary: "הבנת המסגרת החוקית של דוחות חניה יכולה לסייע רבות בהגשת ערעור מוצלח. במאמר זה נסקור את החוקים והתקנות הרלוונטיים ואת זכויותיכם כנהגים.",
              category: "משפטי",
              publishDate: "15.12.2023",
              readTime: "7 דקות",
              author: "עו״ד דוד לוינסון",
              authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 4,
              title: "כיצד הבינה המלאכותית משנה את עולם הערעורים על דוחות",
              summary: "טכנולוגיות מתקדמות כמו בינה מלאכותית משנות את האופן שבו מוגשים ערעורים על דוחות. גלו כיצד AI יכול לשפר משמעותית את סיכויי ההצלחה של הערעור שלכם.",
              category: "טכנולוגיה",
              publishDate: "22.12.2023",
              readTime: "5 דקות",
              author: "מיכל אברהמי",
              authorImage: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 5,
              title: "מקרה בוחן: כיצד הצלחנו לבטל דוח של 1,000₪ עבור לקוח",
              summary: "ניתוח מפורט של מקרה אמיתי בו סייענו ללקוח לבטל דוח חניה משמעותי. במאמר זה נחשוף את האסטרטגיה שהובילה להצלחה ואת הלקחים העיקריים.",
              category: "מקרי בוחן",
              publishDate: "05.01.2024",
              readTime: "8 דקות",
              author: "גיל שטיינברג",
              authorImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1586791965591-15d8892f4333?auto=format&fit=crop&q=80&w=600"
            },
            {
              id: 6,
              title: "סטטיסטיקה מפתיעה: 78% מהערעורים על דוחות חניה מתקבלים",
              summary: "מחקר חדש חושף כי רוב הערעורים המוגשים על דוחות חניה מתקבלים, אך רוב הנהגים כלל לא מערערים. במאמר זה נציג את הנתונים המפתיעים ומה המשמעות עבורכם.",
              category: "סטטיסטיקה",
              publishDate: "18.01.2024",
              readTime: "4 דקות",
              author: "ד״ר רונאל כהן",
              authorImage: "https://images.unsplash.com/photo-1584999734482-0361aecad844?auto=format&fit=crop&q=80&w=50",
              image: "https://images.unsplash.com/photo-1423592707957-3b212afa6733?auto=format&fit=crop&q=80&w=600"
            }
          ];
          setBlogPosts(hebrewPosts);
        }
      } catch (error) {
        console.error("Error loading blog posts:", error);
      }
    };
    
    loadBlogPosts();
  }, [language]); // Re-run this effect when language changes

  const handleStartClick = () => {
    navigate(createPageUrl("Appeal"));
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Separate testimonials by language
  const testimonials = language === 'en' ? [
    {
      name: "Roy Levy",
      position: "Business Owner",
      location: "New York",
      text: "We thought there was no chance they would cancel our $70 ticket, but FineFix's system managed to craft such a precise and convincing appeal that the municipality cancelled the ticket completely. The $20 investment was worth every penny and more!",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
      rating: 5
    },
    {
      name: "Michelle Cohen",
      position: "Attorney",
      location: "Los Angeles",
      text: "We received a $120 parking ticket and knew it wasn't justified because the sign wasn't clear. In less than 10 minutes, we were able to submit a professional appeal with their smart system. The ticket was completely cancelled within just two weeks!",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
      rating: 5
    },
    {
      name: "David Abraham",
      position: "Student",
      location: "Chicago",
      text: "We received a $140 parking ticket for parking in a red-white zone. It seemed absurd because the area was dark and there was no clear marking. FineFix's service was efficient, professional, and saved us a lot of bureaucracy. Happily, the ticket was completely cancelled!",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=100",
      rating: 5
    }
  ] : [
    {
      name: "רועי לוי",
      position: "בעל עסק",
      location: "תל אביב",
      text: "חשבנו שאין סיכוי שיבטלו לנו את הדוח על סך 250 ש״ח, אבל המערכת של FineFix הצליחה לנסח ערעור כל כך מדויק ומשכנע שהעירייה ביטלה את הדוח לחלוטין. ההשקעה של 80 ש״ח הייתה שווה כל אגורה ויותר!",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
      rating: 5
    },
    {
      name: "מיכל כהן",
      position: "עורכת דין",
      location: "ירושלים",
      text: "קיבלנו דוח חניה על סך 420 ש״ח וידענו שזה לא מוצדק כי השילוט לא היה ברור. תוך פחות מ-10 דקות, הצלחנו להגיש ערעור מקצועי עם המערכת החכמה שלהם. הדוח בוטל לחלוטין תוך שבועיים בלבד!",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
      rating: 5
    },
    {
      name: "דוד אברהם",
      position: "סטודנט",
      location: "חיפה",
      text: "קיבלנו דוח חניה על סך 500 ש״ח על חניה באדום-לבן. זה נראה אבסורדי כי האזור היה חשוך ולא היה סימון ברור. השירות של FineFix היה יעיל, מקצועי וחסך לנו המון בירוקרטיה. בשמחה רבה, הדוח בוטל לחלוטין!",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=100",
      rating: 5
    }
  ];

  // Separate case studies by language
  const caseStudies = language === 'en' ? [
    {
      title: "Red-White Zone Parking Due to Medical Emergency",
      description: "A driver who parked in a red-white zone due to a severe anxiety attack. The appeal focused on the medical emergency circumstances and presented medical certificates.",
      type: "red_white",
      amount: 140,
      success: true,
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Parking in a Forbidden Area Due to Unclear Signage",
      description: "A driver who parked in a forbidden area because of a sign hidden by a tree. We attached photos proving the lack of clarity of the sign.",
      type: "forbidden",
      amount: 70,
      success: true,
      image: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Delivery Zone Parking Misunderstanding",
      description: "A driver received a ticket for parking in a delivery zone while actually making a delivery. The appeal highlighted the purpose of the stop with business documentation.",
      type: "forbidden",
      amount: 90,
      success: true,
      image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Resident Parking Permit Technical Error",
      description: "A resident with a valid permit received a ticket due to a database error. We provided proof of valid permit registration that was overlooked by the ticketing system.",
      type: "unmarked",
      amount: 60,
      success: true,
      image: "https://images.unsplash.com/photo-1597987482139-65c918585f3d?auto=format&fit=crop&q=80&w=600"
    }
  ] : [
    {
      title: "חניה באדום-לבן בשל מצב חירום רפואי",
      description: "נהג שחנה באזור אדום-לבן בשל התקף חרדה חמור. הערעור התמקד בנסיבות החירום הרפואיות והציג אישורים רפואיים.",
      type: "red_white",
      amount: 500,
      success: true,
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "חניה באזור אסור בשל שילוט לא ברור",
      description: "נהג שחנה באזור אסור בגלל תמרור שהוסתר על ידי עץ. צירפנו תמונות המוכחות את חוסר הבהירות של השילוט.",
      type: "forbidden",
      amount: 250,
      success: true,
      image: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "אי הבנה לגבי חניה באזור פריקה וטעינה",
      description: "נהג קיבל דוח על חניה באזור פריקה וטעינה בזמן שביצע משלוח. הערעור הדגיש את מטרת העצירה עם תיעוד עסקי.",
      type: "forbidden",
      amount: 320,
      success: true,
      image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "טעות טכנית בתו חניה לתושב",
      description: "תושב עם תו חניה תקף קיבל דוח בשל טעות במאגר הנתונים. סיפקנו הוכחה לרישום תקף של התו שנעלם ממערכת הדוחות.",
      type: "unmarked",
      amount: 220,
      success: true,
      image: "https://images.unsplash.com/photo-1597987482139-65c918585f3d?auto=format&fit=crop&q=80&w=600"
    }
  ];

  // Separate FAQ items by language
  const faqItems = language === 'en' ? [
    {
      question: "How much does FineFix's service cost?",
      answer: "FineFix's service costs just $20 per appeal. You only pay if you decide to submit the appeal generated by our system. There's no upfront payment and no hidden costs."
    },
    {
      question: "Is there a real chance that our appeal will be accepted?",
      answer: "Absolutely! According to our data, over 90% of appeals submitted through our system were fully or partially accepted. The system analyzes your case and generates a well-reasoned appeal based on legal precedents and previous experience."
    },
    {
      question: "How long does it take to get a response to the appeal?",
      answer: "The response time varies by local authority, but usually the answer is received within 14-30 days. Our system allows you to submit the appeal in just a few minutes, so you can save time and effort in the filing process."
    },
    {
      question: "Can you appeal all types of parking tickets?",
      answer: "Yes, our system supports all types of parking tickets: parking in red-white zones, parking in forbidden areas, parking without payment, parking in spaces reserved for disabled people, and all other types of tickets. For each type of ticket, we develop a unique appeal strategy."
    },
    {
      question: "What information do we need to prepare to submit an appeal?",
      answer: "You will need the basic details of the ticket: ticket number, vehicle number, date and location of parking. Additionally, it's recommended to prepare any relevant documentation such as photos of the location, payment receipts, or medical certificates if relevant."
    },
    {
      question: "What happens if our appeal is rejected?",
      answer: "Even if the appeal is rejected, you don't lose anything beyond the cost of the service. There's always the option to file an appeal to the local affairs court, and in some cases we even recommend doing so and provide the necessary documents."
    },
    {
      question: "Can we appeal an old ticket?",
      answer: "According to the law, you can file an appeal within 30 days of receiving the ticket. If more than 30 days have passed, you can still try to file an appeal, but the chances of success are lower. It's recommended to act as quickly as possible after receiving the ticket."
    },
    {
      question: "Is the service available nationwide?",
      answer: "Yes, our service is available throughout the United States and covers all local authorities and municipalities. The system is constantly updated with legislative changes and new legal precedents in all jurisdictions."
    }
  ] : [
    {
      question: "כמה עולה השירות של FineFix?",
      answer: "השירות של FineFix עולה רק 80 ש״ח לערעור. אתם משלמים רק אם אתם מחליטים להגיש את הערעור שנוצר על ידי המערכת שלנו. אין תשלום מראש ואין עלויות נסתרות."
    },
    {
      question: "האם יש סיכוי אמיתי שהערעור שלנו יתקבל?",
      answer: "בהחלט! על פי הנתונים שלנו, יותר מ-90% מהערעורים שהוגשו דרך המערכת שלנו התקבלו באופן מלא או חלקי. המערכת מנתחת את המקרה שלכם ומייצרת ערעור מנומק היטב המבוסס על תקדימים משפטיים וניסיון קודם."
    },
    {
      question: "כמה זמן לוקח לקבל תשובה לערעור?",
      answer: "זמן התגובה משתנה לפי הרשות המקומית, אך ב``כ התשובה מתקבלת תוך 14-30 יום. המערכת שלנו מאפשרת להגיש את הערעור תוך דקות ספורות בלבד."
    },
    {
      question: "האם ניתן לערער על כל סוגי דוחות החניה?",
      answer: "כן, המערכת שלנו תומכת בכל סוגי דוחות החניה: חניה באדום-לבן, חניה באזורים אסורים, חניה ללא תשלום, חניה במקומות המיועדים לנכים, וכל סוגי הדוחות האחרים."
    },
    {
      question: "איזה מידע צריך להכין כדי להגיש ערעור?",
      answer: "תצטרכו את הפרטים הבסיסיים של הדוח: מספר הדוח, מספר הרכב, תאריך ומיקום החניה. בנוסף, מומלץ להכין כל תיעוד רלוונטי כגון תמונות של המיקום, קבלות תשלום או אישורים רפואיים במידת הצורך."
    },
    {
      question: "מה קורה אם הערעור שלנו נדחה?",
      answer: "גם אם הערעור נדחה, אתם לא מפסידים דבר מעבר לעלות השירות. תמיד קיימת האפשרות להגיש ערעור לבית המשפט לעניינים מקומיים, ובמקרים מסוימים אנו אף ממליצים לעשות זאת ומספקים את המסמכים הדרושים."
    },
    {
      question: "האם ניתן לערער על דוח ישן?",
      answer: "על פי החוק, ניתן להגיש ערעור תוך 30 יום מקבלת הדוח. אם עברו יותר מ-30 יום, עדיין ניתן לנסות להגיש ערעור, אך הסיכויים להצלחה נמוכים יותר. מומלץ לפעול במהירות האפשרית לאחר קבלת הדוח."
    },
    {
      question: "האם השירות זמין בכל הארץ?",
      answer: "כן, השירות שלנו זמין בכל רחבי ישראל ומכסה את כל הרשויות המקומיות והעיריות. המערכת מתעדכנת באופן קבוע בשינויי חקיקה ותקדימים משפטיים חדשים בכל תחומי השיפוט."
    }
  ];

  // Add language-specific categories
  const categories = language === 'en' ? [
    { id: "all", name: "All" },
    { id: "tips", name: "Tips" },
    { id: "guides", name: "Guides" },
    { id: "legal", name: "Legal" },
    { id: "tech", name: "Technology" },
    { id: "cases", name: "Case Studies" }
  ] : [
    { id: "all", name: "הכל" },
    { id: "tips", name: "טיפים" },
    { id: "guides", name: "מדריכים" },
    { id: "legal", name: "משפטי" },
    { id: "tech", name: "טכנולוגיה" },
    { id: "cases", name: "מקרי בוחן" }
  ];

  const filteredPosts = blogPosts.filter(post => {
    if (activeCategory !== "all") {
      let categoryMatches = false;
      
      if (language === 'en') {
        categoryMatches = 
          (activeCategory === "tips" && post.category === "Tips") ||
          (activeCategory === "guides" && post.category === "Guides") ||
          (activeCategory === "legal" && post.category === "Legal") ||
          (activeCategory === "tech" && post.category === "Technology") ||
          (activeCategory === "cases" && post.category === "Case Studies");
      } else {
        categoryMatches = 
          (activeCategory === "tips" && post.category === "טיפים") ||
          (activeCategory === "guides" && post.category === "מדריכים") ||
          (activeCategory === "legal" && post.category === "משפטי") ||
          (activeCategory === "tech" && post.category === "טכנולוגיה") ||
          (activeCategory === "cases" && post.category === "מקרי בוחן");
      }
      
      if (!categoryMatches) return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleContactFormChange = (e) => {
    const { id, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setContactFormLoading(true);

    try {
      const { SendEmail } = await import("@/api/integrations");
      await SendEmail({
        to: "support@finefix.com",
        subject: `New contact form inquiry: ${contactForm.subject}`,
        body: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${contactForm.name}</p>
          <p><strong>Phone:</strong> ${contactForm.phone}</p>
          <p><strong>Email:</strong> ${contactForm.email}</p>
          <p><strong>Subject:</strong> ${contactForm.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${contactForm.message}</p>
        `
      });

      setContactFormSubmitted(true);
      setContactForm({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending contact form:", error);
      alert(language === 'en' 
        ? "An error occurred while sending the form. Please try again later."
        : "אירעה שגיאה בשליחת הטופס. אנא נסו שוב מאוחר יותר."
      );
    } finally {
      setContactFormLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <title>
        {language === 'en' 
          ? "The Leading Ticket Solution - Cancel Your Ticket Quickly and Easily with FineFix"
          : "הפתרון המוביל לדוחות - בטל את הדוח שלך במהירות ובקלות עם FineFix"}
      </title>
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-12 md:py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-lg mx-auto md:mx-0">
              <div className="mb-6 inline-block">
                <Badge className="bg-blue-100 text-blue-800 py-1 px-3 text-sm rounded-full">
                  {language === 'en' 
                    ? "#1 Appeal Solution in the US"
                    : "פתרון הערעורים מספר 1 בישראל"}
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gray-900">
                  {language === 'en' 
                    ? "Cancel your parking tickets"
                    : "בטל את דוחות החניה שלך"}
                </span>
                <span className="text-blue-600">
                  {language === 'en' 
                    ? " easily and quickly"
                    : " בקלות ובמהירות"}
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-8">
                {language === 'en' 
                  ? "Submit a well-reasoned, high-quality appeal for your parking tickets with the help of advanced artificial intelligence."
                  : "הגש ערעור מנומק ואיכותי על דוחות החניה שלך בעזרת בינה מלאכותית מתקדמת."}
                <span className="font-semibold">
                  {language === 'en'
                    ? " Over 90% success"
                    : " מעל 90% הצלחה"} 
                </span>
                {language === 'en'
                  ? " in cancelling tickets!"
                  : " בביטול דוחות!"}
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                <Button
                  onClick={handleStartClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg shadow-lg transition-transform hover:scale-105"
                >
                  {language === 'en' ? "Start Now" : "התחל עכשיו"}
                  <ArrowLeft className="w-5 h-5 rtl:mr-2 ltr:ml-2 rtl:rotate-180" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => scrollToSection('how-it-works')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl text-lg shadow-sm hover:bg-blue-50"
                >
                  {language === 'en' ? "How It Works" : "איך זה עובד"}
                </Button>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{count.success}%</div>
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? "Success Rate" : "אחוזי הצלחה"}
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{count.users.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? "Satisfied Users" : "משתמשים מרוצים"}
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                    {language === 'en' ? "$20" : "₪80"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? "Fixed Price Only" : "מחיר קבוע בלבד"}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="text-xl font-semibold">
                    {language === 'en'
                      ? "Example of an Appeal Generated in Our System"
                      : "דוגמה לערעור שנוצר במערכת שלנו"}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="font-medium mb-1">
                      {language === 'en' ? "Case:" : "מקרה:"}
                    </div>
                    <div className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {language === 'en'
                        ? "$70 parking ticket for parking in a forbidden area, where the sign was partially hidden by a tree."
                        : "דוח חניה בסך 250 ש״ח על חניה באזור אסור, כאשר השלט היה מוסתר חלקית על ידי עץ."}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="font-medium mb-1">
                      {language === 'en' ? "Appeal Letter:" : "מכתב הערעור:"}
                    </div>
                    <div className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg h-48 overflow-y-auto">
                      {language === 'en' ? (
                        <>
                          <p>To:</p>
                          <p>Parking Department</p>
                          <p>City of San Francisco</p>
                          <br />
                          <p>Re: Appeal of Parking Ticket #12345678</p>
                          <br />
                          <p>To whom it may concern,</p>
                          <br />
                          <p>I am writing to appeal the parking ticket #12345678, issued to vehicle #ABC-123 on December 15, 2023, at 123 Main Street, San Francisco.</p>
                          <br />
                          <p>I request that this ticket be dismissed for the following reasons:</p>
                          <p>1. The sign prohibiting parking in the area was partially obscured by branches of a tree, making it impossible to see clearly (photos attached for reference).</p>
                          <p>2. In previous rulings (Case #4678/10), it was determined that in cases where signage is not clearly visible, the driver cannot be held responsible.</p>
                          <p>3. I acted in good faith and had no intention to violate the law.</p>
                          <br />
                          <p>Based on the above, I respectfully request that this parking ticket be cancelled.</p>
                          <br />
                          <p>Sincerely,</p>
                          <p>John Smith</p>
                        </>
                      ) : (
                        <>
                          <p>לכבוד:</p>
                          <p>מחלקת החניה</p>
                          <p>עיריית תל אביב</p>
                          <br />
                          <p>הנדון: ערעור על דוח חניה מספר 12345678</p>
                          <br />
                          <p>למי שזה נוגע בדבר,</p>
                          <br />
                          <p>אני פונה בערעור על דוח חניה מספר 12345678, שהוצא לרכב מספר 123-456-78 בתאריך 15 בדצמבר 2023, ברחוב הרצל 123, תל אביב.</p>
                          <br />
                          <p>אני מבקש לבטל את הדוח מהסיבות הבאות:</p>
                          <p>1. השלט האוסר חניה באזור היה מוסתר חלקית על ידי ענפים של עץ, מה שהפך אותו לבלתי נראה בבירור (תמונות מצורפות להמחשה).</p>
                          <p>2. בפסיקות קודמות (פסק דין 4678/10), נקבע כי במקרים בהם שילוט אינו נראה בבירור, לא ניתן להחזיק את הנהג כאחראי.</p>
                          <p>3. פעלתי בתום לב ולא הייתה לי כל כוונה להפר את החוק.</p>
                          <br />
                          <p>על סמך האמור לעיל, אני מבקש בכבוד כי דוח החניה יבוטל.</p>
                          <br />
                          <p>בכבוד רב,</p>
                          <p>ישראל ישראלי</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium mb-1">
                      {language === 'en' ? "Result:" : "תוצאה:"}
                    </div>
                    <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm flex items-center">
                      <CheckCircle2 className="w-5 h-5 rtl:ml-2 ltr:mr-2" />
                      <span className="font-medium">
                        {language === 'en'
                          ? "The ticket was fully cancelled!"
                          : "הדוח בוטל לחלוטין!"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 flex justify-center">
                  <Button 
                    onClick={handleStartClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
                  >
                    {language === 'en'
                      ? "Try it yourself now"
                      : "נסה זאת בעצמך עכשיו"}
                  </Button>
                </div>
              </motion.div>
              
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-blue-100 text-blue-800 py-1 px-3 mb-4">
              {language === 'en' ? "Simple 4-Step Process" : "תהליך פשוט ב-4 שלבים"}
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' ? "How It Works" : "איך זה עובד"}
            </h2>
            <p className="text-gray-600 text-lg">
              {language === 'en'
                ? "Our system transforms the complicated appeal process into something simple and accessible, giving you the best chance of getting your ticket cancelled."
                : "המערכת שלנו הופכת את תהליך הערעור המורכב למשהו פשוט ונגיש, ומעניקה לך את הסיכוי הטוב ביותר לביטול הדוח."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Fixed the dynamic component rendering issue */}
            {(language === 'en' ? [
              {
                title: "Fill in Details",
                description: "Enter your ticket and vehicle details into the system. Add your reason for appealing.",
                colorClass: "bg-blue-100",
                textColorClass: "text-blue-600",
                icon: <FileText className="w-7 h-7 text-blue-600" />
              },
              {
                title: "Automatic Generation",
                description: "Our artificial intelligence will analyze the case and generate a professional and particularly convincing appeal letter.",
                colorClass: "bg-indigo-100",
                textColorClass: "text-indigo-600",
                icon: <Bot className="w-7 h-7 text-indigo-600" />
              },
              {
                title: "Approve and Pay",
                description: "Review the proposed letter, approve it, and pay just $20 to submit your appeal.",
                colorClass: "bg-green-100",
                textColorClass: "text-green-600",
                icon: <FileText className="w-7 h-7 text-green-600" />
              },
              {
                title: "Get Results",
                description: "We send your appeal to the authorities. Most appeals are approved within 14-30 days!",
                colorClass: "bg-yellow-100",
                textColorClass: "text-yellow-600",
                icon: <CheckCircle2 className="w-7 h-7 text-yellow-600" />
              }
            ] : [
              {
                title: "מילוי פרטים",
                description: "הזן את פרטי הדוח והרכב שלך למערכת. הוסף את הסיבה לערעור.",
                colorClass: "bg-blue-100",
                textColorClass: "text-blue-600",
                icon: <FileText className="w-7 h-7 text-blue-600" />
              },
              {
                title: "יצירה אוטומטית",
                description: "הבינה המלאכותית שלנו תנתח את המקרה ותייצר מכתב ערעור מקצועי ומשכנע במיוחד.",
                colorClass: "bg-indigo-100",
                textColorClass: "text-indigo-600",
                icon: <Bot className="w-7 h-7 text-indigo-600" />
              },
              {
                title: "אישור ותשלום",
                description: "עבור על המכתב המוצע, אשר אותו, ושלם רק 80 ₪ להגשת הערעור.",
                colorClass: "bg-green-100",
                textColorClass: "text-green-600",
                icon: <FileText className="w-7 h-7 text-green-600" />
              },
              {
                title: "קבלת תוצאות",
                description: "אנו שולחים את הערעור שלך לרשויות. רוב הערעורים מאושרים תוך 14-30 יום!",
                colorClass: "bg-yellow-100",
                textColorClass: "text-yellow-600",
                icon: <CheckCircle2 className="w-7 h-7 text-yellow-600" />
              }
            ]).map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 ${step.colorClass} rounded-lg flex items-center justify-center mb-6`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <div className="mt-4 text-sm font-medium">
                  <span className="text-blue-600">
                    {language === 'en' ? `Step ${index + 1}` : `שלב ${index + 1}`}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button
              onClick={handleStartClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg shadow-lg"
            >
              {language === 'en' ? "Start Your Appeal Now" : "התחל את הערעור שלך עכשיו"}
              <ArrowLeft className="w-5 h-5 rtl:mr-2 ltr:ml-2 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-indigo-100 text-indigo-800 py-1 px-3 mb-4">
              {language === 'en' ? "Benefits" : "יתרונות"}
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' 
                ? "Why Choose FineFix"
                : "למה לבחור ב-FineFix"}
            </h2>
            <p className="text-gray-600 text-lg">
              {language === 'en'
                ? "We offer a unique approach to appealing parking tickets, using advanced technology and legal expertise to maximize your chances of success."
                : "אנו מציעים גישה ייחודית לערעור על דוחות חניה, באמצעות טכנולוגיה מתקדמת ומומחיות משפטית כדי למקסם את סיכויי ההצלחה שלך."}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(language === 'en' ? [
              {
                icon: <Clock className="w-10 h-10 text-blue-600" />,
                title: "Save Time",
                description: "Our system generates professional appeals in minutes, saving you hours of research and writing."
              },
              {
                icon: <Award className="w-10 h-10 text-blue-600" />,
                title: "Expert Knowledge",
                description: "Our AI is trained on thousands of successful appeals and legal precedents to create the most effective arguments."
              },
              {
                icon: <Shield className="w-10 h-10 text-blue-600" />,
                title: "Risk-Free",
                description: "You only pay for appeals you choose to submit. No upfront costs and no charges if you're not satisfied."
              },
              {
                icon: <CheckCircle2 className="w-10 h-10 text-blue-600" />,
                title: "High Success Rate",
                description: "Over 90% of appeals submitted through our system are accepted fully or partially."
              },
              {
                icon: <Star className="w-10 h-10 text-blue-600" />,
                title: "User-Friendly",
                description: "Simple, intuitive interface designed for everyone, no legal knowledge required."
              },
              {
                icon: <CarFront className="w-10 h-10 text-blue-600" />,
                title: "All Ticket Types",
                description: "We support appeals for all types of parking violations across all municipalities."
              }
            ] : [
              {
                icon: <Clock className="w-10 h-10 text-blue-600" />,
                title: "חיסכון בזמן",
                description: "המערכת שלנו מייצרת ערעורים מקצועיים תוך דקות, חוסכת לך שעות של מחקר וכתיבה."
              },
              {
                icon: <Award className="w-10 h-10 text-blue-600" />,
                title: "ידע מומחה",
                description: "ה-AI שלנו מאומן על אלפי ערעורים מוצלחים ותקדימים משפטיים כדי ליצור את הטיעונים האפקטיביים ביותר."
              },
              {
                icon: <Shield className="w-10 h-10 text-blue-600" />,
                title: "ללא סיכון",
                description: "אתה משלם רק עבור ערעורים שאתה בוחר להגיש. אין עלויות מראש ואין חיובים אם אינך מרוצה."
              },
              {
                icon: <CheckCircle2 className="w-10 h-10 text-blue-600" />,
                title: "אחוז הצלחה גבוה",
                description: "מעל 90% מהערעורים שהוגשו דרך המערכת שלנו מתקבלים באופן מלא או חלקי."
              },
              {
                icon: <Star className="w-10 h-10 text-blue-600" />,
                title: "ידידותי למשתמש",
                description: "ממשק פשוט ואינטואיטיבי המיועד לכולם, לא נדרש ידע משפטי."
              },
              {
                icon: <CarFront className="w-10 h-10 text-blue-600" />,
                title: "כל סוגי הדוחות",
                description: "אנו תומכים בערעורים עבור כל סוגי עבירות החניה בכל הרשויות המקומיות."
              }
            ]).map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow border border-gray-100"
              >
                <div className="mb-5">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-green-100 text-green-800 py-1 px-3 mb-4">
              {language === 'en' ? "Testimonials" : "המלצות"}
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' 
                ? "What Our Users Say"
                : "מה המשתמשים שלנו אומרים"}
            </h2>
            <p className="text-gray-600 text-lg">
              {language === 'en'
                ? "Don't just take our word for it. Hear from some of the thousands of drivers who have successfully appealed their tickets with our help."
                : "אל תסתמכו רק על המילה שלנו. שמעו מחלק מאלפי הנהגים שערערו בהצלחה על הדוחות שלהם בעזרתנו."}
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow"
                onClick={() => {
                  setActiveTestimonial(prev => 
                    prev === 0 ? testimonials.length - 1 : prev - 1
                  );
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow"
                onClick={() => {
                  setActiveTestimonial(prev => 
                    prev === testimonials.length - 1 ? 0 : prev + 1
                  );
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <AnimatePresence mode="wait">
                <TestimonialCard 
                  key={activeTestimonial}
                  testimonial={testimonials[activeTestimonial]} 
                />
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 w-10 rounded-full transition-colors ${
                    index === activeTestimonial ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-yellow-100 text-yellow-800 py-1 px-3 mb-4">
              {language === 'en' ? "Case Studies" : "מקרי בוחן"}
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' 
                ? "Real Success Stories"
                : "סיפורי הצלחה אמיתיים"}
            </h2>
            <p className="text-gray-600 text-lg">
              {language === 'en'
                ? "Here are some examples of real cases where we helped drivers successfully appeal their parking tickets."
                : "הנה כמה דוגמאות של מקרים אמיתיים בהם עזרנו לנהגים לערער בהצלחה על דוחות החניה שלהם."}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {caseStudies.map((caseStudy, index) => (
              <CaseStudyCard 
                key={index}
                {...caseStudy}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-900 text-blue-100 py-1 px-3 mb-4">
              {language === 'en' ? "Statistics" : "סטטיסטיקה"}
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-white">
              {language === 'en' 
                ? "Our Impact in Numbers"
                : "ההשפעה שלנו במספרים"}
            </h2>
            <p className="text-blue-200 text-lg">
              {language === 'en'
                ? "Since our founding, we've helped thousands of drivers successfully appeal their parking tickets and save millions of dollars."
                : "מאז הקמתנו, עזרנו לאלפי נהגים לערער בהצלחה על דוחות החניה שלהם ולחסוך מיליוני שקלים."}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter 
              icon={Users} 
              value={count.users} 
              label={language === 'en' ? "Users" : "משתמשים"} 
              iconColor="blue-300"
            />
            <StatCounter 
              icon={FileText} 
              value={count.appeals} 
              label={language === 'en' ? "Appeals Filed" : "ערעורים שהוגשו"} 
              iconColor="blue-300"
            />
            <StatCounter 
              icon={Award} 
              value={count.success} 
              label={language === 'en' ? "Success Rate" : "אחוז הצלחה"} 
              suffix="%" 
              iconColor="blue-300"
            />
            <StatCounter 
              icon={DollarSign} 
              value={language === 'en' ? 2.5 : 9}
              label={language === 'en' ? "Million $ Saved" : "מיליון ₪ נחסכו"} 
              iconColor="blue-300"
              decimals={1}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-purple-100 text-purple-800 py-1 px-3 mb-4">
              {language === 'en' ? "FAQ" : "שאלות נפוצות"}
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' 
                ? "Frequently Asked Questions"
                : "שאלות נפוצות"}
            </h2>
            <p className="text-gray-600 text-lg">
              {language === 'en'
                ? "Have questions about how our service works? Find answers to common questions below."
                : "יש לך שאלות על איך השירות שלנו עובד? מצא תשובות לשאלות נפוצות למטה."}
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-lg p-5 shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button
                onClick={handleStartClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg shadow-lg"
              >
                {language === 'en' ? "Start Your Appeal Now" : "התחל את הערעור שלך עכשיו"}
                <ArrowLeft className="w-5 h-5 rtl:mr-2 ltr:ml-2 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog-section" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge className="bg-pink-100 text-pink-800 py-1 px-3 mb-4">
              {language === 'en' ? "Blog" : "בלוג"}
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' 
                ? "Latest Articles & Tips"
                : "מאמרים וטיפים אחרונים"}
            </h2>
            <p className="text-gray-600 text-lg">
              {language === 'en'
                ? "Stay informed with our latest articles, guides, and tips about parking tickets and how to appeal them effectively."
                : "הישאר מעודכן עם המאמרים, המדריכים והטיפים האחרונים שלנו על דוחות חניה וכיצד לערער עליהם ביעילות."}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder={language === 'en' ? "Search articles..." : "חיפוש מאמרים..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={activeCategory === category.id ? "bg-blue-600" : ""}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {language === 'en' 
                  ? "No articles found matching your criteria."
                  : "לא נמצאו מאמרים התואמים את הקריטריונים שלך."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-teal-100 text-teal-800 py-1 px-3 mb-4">
                {language === 'en' ? "Contact Us" : "צור קשר"}
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                {language === 'en' 
                  ? "Get in Touch"
                  : "צור איתנו קשר"}
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                {language === 'en'
                  ? "Have questions about our service? Need help with your appeal? Our team is here to assist you."
                  : "יש לך שאלות על השירות שלנו? צריך עזרה עם הערעור שלך? הצוות שלנו כאן כדי לסייע לך."}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">
                      {language === 'en' ? "Address" : "כתובת"}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en' 
                        ? "123 Tech Street, San Francisco, CA 94107"
                        : "רחוב הטכנולוגיה 1, תל אביב"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">
                      {language === 'en' ? "Email" : "אימייל"}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en' 
                        ? "support@finefix.com"
                        : "support@finefix.co.il"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">
                      {language === 'en' ? "Phone" : "טלפון"}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en' 
                        ? "+1 (800) 123-4567"
                        : "03-1234567"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">
                      {language === 'en' ? "Business Hours" : "שעות פעילות"}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en' 
                        ? "Monday - Friday, 9am - 6pm"
                        : "ראשון - חמישי, 9:00 - 18:00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              {contactFormSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-100 rounded-xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    {language === 'en' 
                      ? "Message Sent Successfully!"
                      : "ההודעה נשלחה בהצלחה!"}
                  </h3>
                  <p className="text-green-700 mb-6">
                    {language === 'en'
                      ? "Thank you for reaching out. We'll get back to you as soon as possible."
                      : "תודה שפנית אלינו. נחזור אליך בהקדם האפשרי."}
                  </p>
                  <Button
                    onClick={() => setContactFormSubmitted(false)}
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-100"
                  >
                    {language === 'en' ? "Send Another Message" : "שלח הודעה נוספת"}
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleContactFormSubmit} className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">
                          {language === 'en' ? "Name" : "שם"}
                        </Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={handleContactFormChange}
                          placeholder={language === 'en' ? "Your name" : "השם שלך"}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">
                          {language === 'en' ? "Phone" : "טלפון"}
                        </Label>
                        <Input
                          id="phone"
                          value={contactForm.phone}
                          onChange={handleContactFormChange}
                          placeholder={language === 'en' ? "Your phone number" : "מספר הטלפון שלך"}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">
                        {language === 'en' ? "Email" : "אימייל"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactFormChange}
                        placeholder={language === 'en' ? "Your email address" : "כתובת האימייל שלך"}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">
                        {language === 'en' ? "Subject" : "נושא"}
                      </Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={handleContactFormChange}
                        placeholder={language === 'en' ? "Message subject" : "נושא ההודעה"}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">
                        {language === 'en' ? "Message" : "הודעה"}
                      </Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={handleContactFormChange}
                        placeholder={language === 'en' ? "Your message..." : "ההודעה שלך..."}
                        className="h-32"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={contactFormLoading}
                    >
                      {contactFormLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {language === 'en' ? "Sending..." : "שולח..."}
                        </>
                      ) : (
                        language === 'en' ? "Send Message" : "שלח הודעה"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Back to top button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-colors"
        >
          <ChevronUp className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
}