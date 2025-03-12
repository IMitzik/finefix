import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ChevronLeft, 
  Filter, 
  ArrowLeft,
  Tag,
  Share2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Blog() {
  const [posts] = useState([
    {
      id: 1,
      title: "איך להתמודד עם דוח חניה לא מוצדק - המדריך המלא",
      summary: "דוח חניה יכול להיות מוצדק, אך במקרים רבים הרשויות טועות. במאמר זה נספק מדריך מפורט כיצד להתמודד עם דוחות חניה בלתי מוצדקים וכיצד להגיש ערעור אפקטיבי.",
      content: `
        <h2>מבוא: הבנת הזכויות שלכם</h2>
        <p>קבלת דוח חניה יכולה להיות חוויה מתסכלת, במיוחד כאשר אתם מאמינים שהדוח ניתן שלא בצדק. חשוב לדעת שיש לכם זכות לערער על דוחות חניה, וב-FineFix אנו רואים שיעורי הצלחה גבוהים בביטול דוחות שניתנו בנסיבות שאינן מוצדקות.</p>
        
        <h2>חלק א: סיבות נפוצות לערעור מוצלח</h2>
        <p>ישנן מספר סיבות נפוצות שיכולות להוביל לביטול דוח חניה:</p>
        <ul>
          <li><strong>שילוט לא ברור או חסר:</strong> אם התמרורים לא היו נראים בבירור או היו חסרים, זו סיבה טובה לערעור.</li>
          <li><strong>נסיבות חירום:</strong> במקרים של חירום רפואי או בטיחותי, ניתן להצדיק חניה במקום אסור.</li>
          <li><strong>תקלה טכנית:</strong> במקרה של תקלה במכשיר התשלום או באפליקציה, שמנעה מכם לשלם עבור החניה.</li>
          <li><strong>טעות בפרטי הדוח:</strong> אם ישנה טעות בפרטי הרכב, המיקום או הזמן בדוח, ניתן לערער על בסיס זה.</li>
        </ul>
      `,
      category: "מדריכים",
      publishDate: "10.11.2023",
      readTime: "6 דקות",
      author: "עו״ד רונית לוי",
      authorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=50",
      authorBio: "עו״ד רונית לוי היא מומחית בדיני תעבורה עם 15 שנות ניסיון בייצוג לקוחות בערעורים על דוחות וקנסות.",
      image: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?auto=format&fit=crop&q=80&w=600",
      tags: ["ערעור דוחות", "זכויות נהגים", "חניה", "טיפים משפטיים"],
      viewCount: 1240
    },
    {
      id: 2,
      title: "5 סיבות מוצדקות לערעור על דוח חניה שכדאי להכיר",
      summary: "ישנן מספר סיבות מוצדקות לערעור על דוח חניה אשר במקרים רבים מובילות לביטול מלא של הקנס. במאמר זה נסקור את 5 הסיבות הנפוצות ביותר שכדאי לכל נהג להכיר.",
      content: "<p>תוכן המאמר המלא כאן...</p>",
      category: "טיפים",
      publishDate: "01.12.2023",
      readTime: "4 דקות",
      author: "אלון כהן",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50",
      authorBio: "אלון כהן הוא יועץ משפטי בתחום דיני התעבורה ומרצה באוניברסיטת תל אביב.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
      tags: ["ערעור דוחות", "טיפים", "חניה אסורה"],
      viewCount: 980
    },
    {
      id: 3,
      title: "מה אומר החוק על דוחות חניה וכיצד זה משפיע על הערעור שלכם",
      summary: "הבנת המסגרת החוקית של דוחות חניה יכולה לסייע רבות בהגשת ערעור מוצלח. במאמר זה נסקור את החוקים והתקנות הרלוונטיים ואת זכויותיכם כנהגים.",
      content: "<p>תוכן המאמר המלא כאן...</p>",
      category: "משפטי",
      publishDate: "15.12.2023",
      readTime: "7 דקות",
      author: "עו״ד דוד לוינסון",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=50",
      authorBio: "עו״ד דוד לוינסון מתמחה בדיני תעבורה וחוקי חניה עירוניים.",
      image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&q=80&w=600",
      tags: ["חוק", "משפט", "תקנות חניה", "זכויות"],
      viewCount: 756
    },
    {
      id: 4,
      title: "כיצד הבינה המלאכותית משנה את עולם הערעורים על דוחות",
      summary: "טכנולוגיות מתקדמות כמו בינה מלאכותית משנות את האופן שבו מוגשים ערעורים על דוחות. גלו כיצד AI יכול לשפר משמעותית את סיכויי ההצלחה של הערעור שלכם.",
      content: "<p>תוכן המאמר המלא כאן...</p>",
      category: "טכנולוגיה",
      publishDate: "22.12.2023",
      readTime: "5 דקות",
      author: "מיכל אברהמי",
      authorImage: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=50",
      authorBio: "מיכל אברהמי היא מומחית לטכנולוגיות AI ויישומן במערכות משפטיות.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
      tags: ["בינה מלאכותית", "טכנולוגיה", "חדשנות", "אוטומציה"],
      viewCount: 1102
    },
    {
      id: 5,
      title: "מקרה בוחן: כיצד הצלחנו לבטל דוח של 1,000₪ עבור לקוח",
      summary: "ניתוח מפורט של מקרה אמיתי בו סייענו ללקוח לבטל דוח חניה משמעותי. במאמר זה נחשוף את האסטרטגיה שהובילה להצלחה ואת הלקחים העיקריים.",
      content: "<p>תוכן המאמר המלא כאן...</p>",
      category: "מקרי בוחן",
      publishDate: "05.01.2024",
      readTime: "8 דקות",
      author: "גיל שטיינברג",
      authorImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=50",
      authorBio: "גיל שטיינברג הוא מנהל מחלקת הערעורים ב-FineFix עם ניסיון של למעלה מ-1000 מקרים.",
      image: "https://images.unsplash.com/photo-1586791965591-15d8892f4333?auto=format&fit=crop&q=80&w=600",
      tags: ["מקרה בוחן", "הצלחות", "אסטרטגיה משפטית"],
      viewCount: 867
    },
    {
      id: 6,
      title: "סטטיסטיקה מפתיעה: 78% מהערעורים על דוחות חניה מתקבלים",
      summary: "מחקר חדש חושף כי רוב הערעורים המוגשים על דוחות חניה מתקבלים, אך רוב הנהגים כלל לא מערערים. במאמר זה נציג את הנתונים המפתיעים ומה המשמעות עבורכם.",
      content: "<p>תוכן המאמר המלא כאן...</p>",
      category: "סטטיסטיקה",
      publishDate: "18.01.2024",
      readTime: "4 דקות",
      author: "ד״ר רוני כהן",
      authorImage: "https://images.unsplash.com/photo-1584999734482-0361aecad844?auto=format&fit=crop&q=80&w=50",
      authorBio: "ד״ר רוני כהן היא חוקרת במכון למדיניות ציבורית ומתמחה בניתוח נתונים בתחום המשפט.",
      image: "https://images.unsplash.com/photo-1423592707957-3b212afa6733?auto=format&fit=crop&q=80&w=600",
      tags: ["סטטיסטיקה", "מחקר", "נתונים", "מגמות"],
      viewCount: 1432
    }
  ]);
  
  const [featuredPost] = useState({
    id: 1,
    title: "איך להתמודד עם דוח חניה לא מוצדק - המדריך המלא",
    summary: "דוח חניה יכול להיות מוצדק, אך במקרים רבים הרשויות טועות. במאמר זה נספק מדריך מפורט כיצד להתמודד עם דוחות חניה בלתי מוצדקים וכיצד להגיש ערעור אפקטיבי.",
    category: "מדריכים",
    publishDate: "10.11.2023",
    readTime: "6 דקות",
    author: "עו״ד רונית לוי",
    authorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=50",
    image: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?auto=format&fit=crop&q=80&w=600"
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "הכל" },
    { id: "tips", name: "טיפים" },
    { id: "guides", name: "מדריכים" },
    { id: "legal", name: "משפטי" },
    { id: "tech", name: "טכנולוגיה" },
    { id: "case-studies", name: "מקרי בוחן" },
    { id: "statistics", name: "סטטיסטיקה" }
  ];

  const filteredPosts = posts.filter(post => {
    // Filter by category
    if (activeCategory !== "all") {
      const categoryMap = {
        "tips": "טיפים",
        "guides": "מדריכים",
        "legal": "משפטי",
        "tech": "טכנולוגיה",
        "case-studies": "מקרי בוחן",
        "statistics": "סטטיסטיקה"
      };
      
      if (post.category !== categoryMap[activeCategory]) {
        return false;
      }
    }
    
    // Filter by search query
    if (searchQuery)  {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with featured post */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">הבלוג שלנו</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              טיפים, מדריכים ומידע שימושי על ערעורי דוחות חניה והמערכת המשפטית בישראל
            </p>
          </div>
          
          {featuredPost && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="h-64 md:h-auto md:rounded-lg overflow-hidden relative">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-blue-600">
                  {featuredPost.category}
                </Badge>
              </div>
              
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-2 space-x-reverse rtl:space-x-reverse">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 ml-1" />
                    <span>{featuredPost.publishDate}</span>
                  </div>
                  <div className="mx-2">•</div>
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 ml-1" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6">{featuredPost.summary}</p>
                
                <div className="flex items-center mb-6">
                  <img
                    src={featuredPost.authorImage}
                    alt={featuredPost.author}
                    className="h-10 w-10 rounded-full object-cover ml-3"
                  />
                  <div>
                    <p className="font-medium">{featuredPost.author}</p>
                    <p className="text-sm text-gray-500">כותב/ת מומחה/ית</p>
                  </div>
                </div>
                
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => alert("המאמר המלא יהיה זמין בקרוב!")}
                >
                  קראו את המאמר המלא
                  <ChevronLeft className="mr-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Blog listing section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="bg-white">
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="text-sm"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            <div className="w-full md:w-64">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="חיפוש מאמרים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-3 right-3 bg-blue-600">{post.category}</Badge>
                    </div>
                    
                    <CardContent className="py-5 flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-2 space-x-reverse rtl:space-x-reverse">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 ml-1" />
                          <span>{post.publishDate}</span>
                        </div>
                        <div className="mx-2">•</div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 ml-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.summary}</p>
                      
                      <div className="flex items-center mt-4">
                        <img
                          src={post.authorImage}
                          alt={post.author}
                          className="h-8 w-8 rounded-full object-cover ml-2"
                        />
                        <span className="text-sm font-medium">{post.author}</span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        className="text-blue-600 p-0 h-auto font-medium hover:bg-transparent hover:text-blue-800 mt-4"
                        onClick={() => alert(`המאמר המלא יהיה זמין בקרוב: ${post.title}`)}
                      >
                        המשך קריאה
                        <ChevronLeft className="h-4 w-4 mr-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-medium mb-2">לא נמצאו תוצאות</h3>
              <p className="text-gray-600 mb-4">נסו לחפש מונחים אחרים או לבחור קטגוריה אחרת</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                הציגו את כל המאמרים
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to action section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">רוצים לבטל את הדוח שלכם?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100">
            אל תשלמו על דוחות לא מוצדקים. מערכת FineFix מספקת פתרון מהיר, יעיל וזול לערעור על דוחות חניה.
          </p>
          <Button 
            onClick={() => navigate(createPageUrl("Appeal"))}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            התחילו עכשיו
            <ArrowLeft className="h-5 w-5 mr-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}