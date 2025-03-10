import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  CreditCard,
  Calendar,
  Lock,
  User,
  Check,
  X,
  LoaderCircle,
  Shield,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Appeal } from "@/api/entities";
import { User as UserEntity } from "@/api/entities";

export default function PaymentForm({ appealData, onSuccess }) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [language, setLanguage] = useState('he'); // Default to Hebrew
  const navigate = useNavigate();

  // Load user language preference
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const user = await UserEntity.me();
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

  // Get translations based on current language
  const getTranslations = () => {
    if (language === 'en') {
      return {
        title: "Payment Details",
        subtitle: "Complete your payment to submit the appeal",
        summaryTitle: "Order Summary",
        appealService: "Appeal Service",
        servicePrice: "$20.00",
        total: "Total",
        cardNumber: "Card Number",
        cardName: "Cardholder Name",
        expiryDate: "Expiry Date",
        cvv: "CVV",
        payButton: "Pay $20.00",
        processingPayment: "Processing Payment...",
        successTitle: "Payment Successful!",
        successMessage: "Your appeal has been submitted successfully. You will be redirected to your dashboard.",
        failureTitle: "Payment Failed",
        failureMessage: "There was an issue processing your payment. Please try again.",
        viewDashboard: "View My Dashboard",
        tryAgain: "Try Again",
        securePayment: "Secure Payment",
        securePaymentMessage: "Your payment information is encrypted and secure. We do not store your card details.",
        placeholders: {
          cardNumber: "XXXX XXXX XXXX XXXX",
          cardName: "As appears on the card",
          expiryDate: "MM / YY",
          cvv: "XXX"
        },
        errors: {
          required: "This field is required",
          invalidCardNumber: "Please enter a valid card number",
          invalidExpiryDate: "Please enter a valid expiry date",
          invalidCvv: "Please enter a valid CVV"
        }
      };
    } else {
      return {
        title: "פרטי תשלום",
        subtitle: "השלם את התשלום כדי להגיש את הערעור",
        summaryTitle: "סיכום הזמנה",
        appealService: "שירות ערעור",
        servicePrice: "₪80.00",
        total: "סה״כ",
        cardNumber: "מספר כרטיס",
        cardName: "שם בעל הכרטיס",
        expiryDate: "תוקף",
        cvv: "CVV",
        payButton: "שלם ₪80.00",
        processingPayment: "מעבד תשלום...",
        successTitle: "התשלום בוצע בהצלחה!",
        successMessage: "הערעור שלך הוגש בהצלחה. אתה תועבר ללוח הבקרה שלך.",
        failureTitle: "התשלום נכשל",
        failureMessage: "אירעה בעיה בעיבוד התשלום שלך. אנא נסה שוב.",
        viewDashboard: "צפה בלוח הבקרה שלי",
        tryAgain: "נסה שוב",
        securePayment: "תשלום מאובטח",
        securePaymentMessage: "פרטי התשלום שלך מוצפנים ומאובטחים. איננו שומרים את פרטי הכרטיס שלך.",
        placeholders: {
          cardNumber: "XXXX XXXX XXXX XXXX",
          cardName: "כפי שמופיע על הכרטיס",
          expiryDate: "MM / YY",
          cvv: "XXX"
        },
        errors: {
          required: "שדה זה הוא חובה",
          invalidCardNumber: "אנא הזן מספר כרטיס תקין",
          invalidExpiryDate: "אנא הזן תאריך תוקף תקין",
          invalidCvv: "אנא הזן CVV תקין"
        }
      };
    }
  };

  const t = getTranslations();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Card number validation
    if (!paymentData.cardNumber.trim()) {
      newErrors.cardNumber = t.errors.required;
      isValid = false;
    } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = t.errors.invalidCardNumber;
      isValid = false;
    }
    
    // Cardholder name validation
    if (!paymentData.cardName.trim()) {
      newErrors.cardName = t.errors.required;
      isValid = false;
    }
    
    // Expiry date validation
    if (!paymentData.expiryDate.trim()) {
      newErrors.expiryDate = t.errors.required;
      isValid = false;
    } else if (!/^\d{2}\s*\/\s*\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = t.errors.invalidExpiryDate;
      isValid = false;
    }
    
    // CVV validation
    if (!paymentData.cvv.trim()) {
      newErrors.cvv = t.errors.required;
      isValid = false;
    } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = t.errors.invalidCvv;
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update appeal status
      await Appeal.update(appealData.id, { 
        payment_status: "paid",
        appeal_status: "submitted"
      });
      
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({
            appealId: appealData.id,
            paymentAmount: language === 'en' ? "$20.00" : "₪80.00"
          });
        }
      }, 3000);
    } catch (error) {
      console.error("Payment error:", error);
      setFailure(true);
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFailure(false);
    setErrors({});
  };

  if (success) {
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">{t.successTitle}</h2>
            <p className="text-gray-600">{t.successMessage}</p>
            
            <Button 
              className="mt-4" 
              onClick={() => navigate(createPageUrl("UserDashboard"))}
            >
              {t.viewDashboard}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (failure) {
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <X className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold">{t.failureTitle}</h2>
            <p className="text-gray-600">{t.failureMessage}</p>
            
            <Button 
              className="mt-4" 
              onClick={resetForm}
            >
              {t.tryAgain}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.subtitle}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                    <Label htmlFor="cardNumber">{t.cardNumber}</Label>
                  </div>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder={t.placeholders.cardNumber}
                    value={paymentData.cardNumber}
                    onChange={handleChange}
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm">{errors.cardNumber}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    <Label htmlFor="cardName">{t.cardName}</Label>
                  </div>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder={t.placeholders.cardName}
                    value={paymentData.cardName}
                    onChange={handleChange}
                    className={errors.cardName ? "border-red-500" : ""}
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm">{errors.cardName}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                      <Label htmlFor="expiryDate">{t.expiryDate}</Label>
                    </div>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder={t.placeholders.expiryDate}
                      value={paymentData.expiryDate}
                      onChange={handleChange}
                      className={errors.expiryDate ? "border-red-500" : ""}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm">{errors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-blue-600 mr-2" />
                      <Label htmlFor="cvv">{t.cvv}</Label>
                    </div>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder={t.placeholders.cvv}
                      value={paymentData.cvv}
                      onChange={handleChange}
                      type="password"
                      className={errors.cvv ? "border-red-500" : ""}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    {t.processingPayment}
                  </>
                ) : (
                  t.payButton
                )}
              </Button>
            </form>
            
            <div className="mt-6">
              <Alert className="bg-blue-50 border-blue-200">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                  <div>
                    <AlertTitle className="text-blue-800">{t.securePayment}</AlertTitle>
                    <AlertDescription className="text-blue-700 text-sm">
                      {t.securePaymentMessage}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.summaryTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t.appealService}</span>
                    <span>{t.servicePrice}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>{t.total}</span>
                    <span>{t.servicePrice}</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex">
                    <Info className="h-5 w-5 text-gray-500 mr-2" />
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? (
                        <p>Your credit card will be charged immediately. The appeal will be submitted after successful payment.</p>
                      ) : (
                        <p>כרטיס האשראי שלך יחויב מיידית. הערעור יוגש לאחר ביצוע התשלום בהצלחה.</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              {appealData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">
                    {language === 'en' ? "Appeal Details" : "פרטי הערעור"}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'en' ? "Car Number" : "מספר רכב"}:
                      </span>
                      <span>{appealData.car_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'en' ? "Ticket Number" : "מספר דוח"}:
                      </span>
                      <span>{appealData.ticket_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'en' ? "Violation Date" : "תאריך העבירה"}:
                      </span>
                      <span>{appealData.violation_date}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}