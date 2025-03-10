import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, 
  FileText, 
  Map, 
  Calendar, 
  Clock, 
  Ban, 
  ThumbsUp, 
  ThumbsDown,
  FileImage, 
  LoaderCircle, 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InvokeLLM, UploadFile } from "@/api/integrations";
import { User } from "@/api/entities";

export default function AppealForm({ onSubmit }) {
  const [language, setLanguage] = useState('he'); // Default to Hebrew
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    carNumber: "",
    ticketNumber: "",
    violationType: "",
    appealer: "",
    violationDate: "",
    violationTime: "",
    violationLocation: "",
    ticketAmount: "",
    wasDriver: "",
    appealReason: "",
    correctParking: "",
    visibleSignage: "",
    otherReason: "",
    documents: [],
    generated_letter: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileErrors, setFileErrors] = useState("");
  const [currentGeneratedLetter, setCurrentGeneratedLetter] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Load user language preference
  useEffect(() => {
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

  // Get translated content based on the current language
  const getTranslations = () => {
    if (language === 'en') {
      return {
        steps: [
          "Vehicle and Ticket Details",
          "Violation Details",
          "Appeal Reason",
          "Additional Details",
          "Document Upload",
          "Generated Appeal"
        ],
        labels: {
          carNumber: "Vehicle License Plate",
          ticketNumber: "Ticket Number",
          violationType: "Violation Type",
          violationDate: "Violation Date",
          violationTime: "Violation Time",
          violationLocation: "Violation Location",
          ticketAmount: "Ticket Amount",
          wasDriver: "Were you the driver at the time of the violation?",
          appealReason: "Reason for Appeal",
          correctParking: "Was the vehicle parked correctly?",
          visibleSignage: "Was the signage clearly visible?",
          otherReason: "Additional details supporting your appeal",
          documentUpload: "Upload Supporting Documents",
          generatedAppeal: "Generated Appeal Letter",
          next: "Next",
          back: "Back",
          submit: "Submit Appeal",
          uploadFile: "Upload File",
          uploadingFile: "Uploading...",
          removeFile: "Remove",
          updateLetter: "Update Letter",
          generatingLetter: "Generating...",
          finish: "Finish and Submit",
          uploadFileHint: "Upload photos of the location, signage, or any relevant documents",
          maxFilesError: "You can upload a maximum of 5 files",
          fileSizeError: "File size must be less than 5MB",
          generateAppealHint: "Based on the details you've provided, our AI will generate a professional appeal letter",
          updateLetterHint: "You can request a new letter if you'd like to change or improve it",
          editLetter: "Edit Letter",
          saveChanges: "Save Changes",
          yesOption: "Yes",
          noOption: "No",
          partialOption: "Partially",
          generateBtn: "Generate Appeal Letter",
          requiredError: "This field is required",
          minLengthError: "Please enter at least {0} characters",
          invalidCarNumberError: "Please enter a valid vehicle license plate number",
          invalidTicketNumberError: "Please enter a valid ticket number"
        },
        appealReasons: [
          { value: "unclear_sign", label: "Unclear or hidden signage" },
          { value: "emergency", label: "Medical or other emergency" },
          { value: "incorrect_details", label: "Incorrect ticket details" },
          { value: "no_violation", label: "No actual violation occurred" },
          { value: "loading_unloading", label: "Brief stop for loading/unloading" },
          { value: "system_error", label: "Meter/payment system error" },
          { value: "other", label: "Other reason" }
        ],
        violationTypes: [
          { value: "red_white", label: "Parking in a red-white zone" },
          { value: "handicapped", label: "Parking in a disabled spot" },
          { value: "unmarked", label: "Parking in an unmarked area" },
          { value: "bus_lane", label: "Parking in a bus lane" },
          { value: "crosswalk", label: "Parking on a crosswalk" },
          { value: "hydrant", label: "Parking by a fire hydrant" },
          { value: "sidewalk", label: "Parking on a sidewalk" },
          { value: "double_parking", label: "Double parking" },
          { value: "expired_meter", label: "Expired meter" },
          { value: "loading_zone", label: "Parking in a loading zone" },
          { value: "other", label: "Other violation" }
        ],
        placeholders: {
          carNumber: "e.g., ABC-123",
          ticketNumber: "e.g., 12345678",
          violationDate: "Select date",
          violationTime: "e.g., 14:30",
          violationLocation: "e.g., 123 Main St., San Francisco",
          ticketAmount: "e.g., $70",
          otherReason: "Please provide any additional details that might support your appeal...",
          editLetter: "Edit the generated letter here..."
        },
        errorMessages: {
          submissionFailed: "There was an error submitting your appeal. Please try again.",
          generationFailed: "Failed to generate the appeal letter. Please try again."
        },
        successMessages: {
          appealGenerated: "Appeal letter generated successfully!",
          fileUploaded: "File uploaded successfully!"
        },
        infos: {
          step1: "Please enter the details of your vehicle and the parking ticket you received.",
          step2: "Please provide details about the violation circumstances.",
          step3: "Select the main reason for appealing this ticket.",
          step4: "These additional details will help strengthen your appeal.",
          step5: "Upload photos or documents that support your appeal (optional but recommended).",
          step6: "Review the generated appeal letter. You can request updates if needed."
        }
      };
    } else {
      return {
        steps: [
          "פרטי הרכב והדו״ח",
          "פרטי העבירה",
          "סיבת הערעור",
          "פרטים נוספים",
          "העלאת מסמכים",
          "ערעור מוכן"
        ],
        labels: {
          carNumber: "מספר רישוי",
          ticketNumber: "מספר דו״ח",
          violationType: "סוג העבירה",
          violationDate: "תאריך העבירה",
          violationTime: "שעת העבירה",
          violationLocation: "מיקום העבירה",
          ticketAmount: "סכום הדו״ח",
          wasDriver: "האם היית הנהג בזמן העבירה?",
          appealReason: "סיבת הערעור",
          correctParking: "האם החניית את הרכב כראוי?",
          visibleSignage: "האם השילוט היה ברור ונראה?",
          otherReason: "פרטים נוספים התומכים בערעור",
          documentUpload: "העלאת מסמכים תומכים",
          generatedAppeal: "מכתב הערעור שנוצר",
          next: "הבא",
          back: "חזרה",
          submit: "הגש ערעור",
          uploadFile: "העלה קובץ",
          uploadingFile: "מעלה...",
          removeFile: "הסר",
          updateLetter: "עדכן מכתב",
          generatingLetter: "מייצר...",
          finish: "סיים והגש",
          uploadFileHint: "העלה תמונות של המיקום, השילוט, או כל מסמך רלוונטי",
          maxFilesError: "ניתן להעלות מקסימום 5 קבצים",
          fileSizeError: "גודל הקובץ חייב להיות פחות מ-5MB",
          generateAppealHint: "בהתבסס על הפרטים שסיפקת, הבינה המלאכותית שלנו תייצר מכתב ערעור מקצועי",
          updateLetterHint: "ניתן לבקש מכתב חדש אם תרצה לשנות או לשפר אותו",
          editLetter: "ערוך מכתב",
          saveChanges: "שמור שינויים",
          yesOption: "כן",
          noOption: "לא",
          partialOption: "חלקית",
          generateBtn: "צור מכתב ערעור",
          requiredError: "שדה זה הוא חובה",
          minLengthError: "אנא הזן לפחות {0} תווים",
          invalidCarNumberError: "אנא הזן מספר רישוי תקין",
          invalidTicketNumberError: "אנא הזן מספר דו״ח תקין"
        },
        appealReasons: [
          { value: "unclear_sign", label: "שילוט לא ברור או מוסתר" },
          { value: "emergency", label: "מצב חירום רפואי או אחר" },
          { value: "incorrect_details", label: "פרטים שגויים בדו״ח" },
          { value: "no_violation", label: "לא בוצעה עבירה בפועל" },
          { value: "loading_unloading", label: "עצירה קצרה לפריקה/העמסה" },
          { value: "system_error", label: "תקלה במדחן/מערכת תשלום" },
          { value: "other", label: "סיבה אחרת" }
        ],
        violationTypes: [
          { value: "red_white", label: "חניה באדום-לבן" },
          { value: "handicapped", label: "חניה בחניית נכים" },
          { value: "unmarked", label: "חניה באזור לא מסומן" },
          { value: "bus_lane", label: "חניה בנתיב אוטובוס" },
          { value: "crosswalk", label: "חניה על מעבר חציה" },
          { value: "hydrant", label: "חניה ליד ברז כיבוי אש" },
          { value: "sidewalk", label: "חניה על מדרכה" },
          { value: "double_parking", label: "חניה כפולה" },
          { value: "expired_meter", label: "מדחן שפג תוקפו" },
          { value: "loading_zone", label: "חניה באזור פריקה וטעינה" },
          { value: "other", label: "עבירה אחרת" }
        ],
        placeholders: {
          carNumber: "לדוגמה: 12-345-67",
          ticketNumber: "לדוגמה: 12345678",
          violationDate: "בחר תאריך",
          violationTime: "לדוגמה: 14:30",
          violationLocation: "לדוגמה: רחוב הרצל 123, תל אביב",
          ticketAmount: "לדוגמה: 250 ₪",
          otherReason: "אנא ספק פרטים נוספים שעשויים לתמוך בערעור שלך...",
          editLetter: "ערוך את המכתב המיוצר כאן..."
        },
        errorMessages: {
          submissionFailed: "אירעה שגיאה בהגשת הערעור. אנא נסה שוב.",
          generationFailed: "נכשל בייצור מכתב הערעור. אנא נסה שוב."
        },
        successMessages: {
          appealGenerated: "מכתב הערעור נוצר בהצלחה!",
          fileUploaded: "הקובץ הועלה בהצלחה!"
        },
        infos: {
          step1: "אנא הזן את פרטי הרכב והדו״ח שקיבלת.",
          step2: "אנא ספק פרטים על נסיבות העבירה.",
          step3: "בחר את הסיבה העיקרית לערעור על הדו״ח.",
          step4: "פרטים נוספים אלה יעזרו לחזק את הערעור שלך.",
          step5: "העלה תמונות או מסמכים התומכים בערעור שלך (אופציונלי אך מומלץ).",
          step6: "סקור את מכתב הערעור שנוצר. תוכל לבקש עדכונים במידת הצורך."
        }
      };
    }
  };

  const t = getTranslations();
  
  // Scroll to top of the form when step changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  // Validate form fields
  const validateField = (name, value) => {
    let errorMessage = "";
    
    if (value === "" || value === null || value === undefined) {
      errorMessage = t.labels.requiredError;
    } else {
      switch (name) {
        case "carNumber":
          // Basic car number validation - can be customized
          if (value.length < 5) {
            errorMessage = t.labels.invalidCarNumberError;
          }
          break;
        case "ticketNumber":
          // Basic ticket number validation - can be customized
          if (value.length < 4) {
            errorMessage = t.labels.invalidTicketNumberError;
          }
          break;
        case "otherReason":
          if (formData.appealReason === "other" && value.length < 10) {
            errorMessage = t.labels.minLengthError.replace("{0}", "10");
          }
          break;
      }
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
    
    return errorMessage === "";
  };

  // Validate step
  const validateStep = () => {
    let isValid = true;
    let newErrors = {};
    
    // Validate fields based on current step
    if (step === 1) {
      ["carNumber", "ticketNumber", "violationType"].forEach(field => {
        const fieldValid = validateField(field, formData[field]);
        isValid = isValid && fieldValid;
        if (!fieldValid) {
          newErrors[field] = t.labels.requiredError;
        }
      });
    } else if (step === 2) {
      ["violationDate", "violationLocation"].forEach(field => {
        const fieldValid = validateField(field, formData[field]);
        isValid = isValid && fieldValid;
        if (!fieldValid) {
          newErrors[field] = t.labels.requiredError;
        }
      });
    } else if (step === 3) {
      const fieldValid = validateField("appealReason", formData.appealReason);
      isValid = isValid && fieldValid;
      if (!fieldValid) {
        newErrors.appealReason = t.labels.requiredError;
      }
      
      if (formData.appealReason === "other") {
        const otherReasonValid = validateField("otherReason", formData.otherReason);
        isValid = isValid && otherReasonValid;
        if (!otherReasonValid) {
          newErrors.otherReason = t.labels.requiredError;
        }
      }
    } else if (step === 4) {
      ["wasDriver", "correctParking", "visibleSignage"].forEach(field => {
        const fieldValid = validateField(field, formData[field]);
        isValid = isValid && fieldValid;
        if (!fieldValid) {
          newErrors[field] = t.labels.requiredError;
        }
      });
    } else if (step === 6 && !formData.generated_letter) {
      isValid = false;
      newErrors.generated_letter = t.labels.requiredError;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      violationDate: date
    }));
    validateField("violationDate", date);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (formData.documents.length >= 5) {
      setFileErrors(t.labels.maxFilesError);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setFileErrors(t.labels.fileSizeError);
      return;
    }
    
    setFileErrors("");
    setUploadingFile(true);
    
    try {
      const result = await UploadFile({ file });
      
      if (result && result.file_url) {
        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, { name: file.name, url: result.file_url }]
        }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileErrors(error.message || "Failed to upload file");
    } finally {
      setUploadingFile(false);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Generate appeal letter using AI
  const generateAppealLetter = async () => {
    setGeneratingLetter(true);
    setErrors({});
    
    try {
      // Get appeal reason text
      const appealReasonText = formData.appealReason === "other"
        ? formData.otherReason
        : t.appealReasons.find(r => r.value === formData.appealReason)?.label || formData.appealReason;
      
      // Get violation type text
      const violationTypeText = t.violationTypes.find(v => v.value === formData.violationType)?.label || formData.violationType;
      
      // Create prompt for the AI
      const prompt = language === 'en' 
      ? `Generate a professional appeal letter for a parking ticket with the following details:
        - Vehicle license plate: ${formData.carNumber}
        - Ticket number: ${formData.ticketNumber}
        - Type of violation: ${violationTypeText}
        - Date and time of the violation: ${formData.violationDate} ${formData.violationTime || ""}
        - Location: ${formData.violationLocation}
        - The appellant was${formData.wasDriver === "yes" ? "" : " not"} the driver at the time.
        - The car was${formData.correctParking === "yes" ? "" : formData.correctParking === "partial" ? " partially" : " not"} parked correctly.
        - The signage was${formData.visibleSignage === "yes" ? "" : formData.visibleSignage === "partial" ? " partially" : " not"} clearly visible.
        - Main appeal reason: ${appealReasonText}
        
        ${formData.otherReason ? `- Additional details: ${formData.otherReason}` : ""}
        
        The letter should be formal, polite, and persuasive. It should include the ticket details, explain why the ticket should be dismissed based on the reason provided, and request that the fine be cancelled. Format it as a proper appeal letter with appropriate sections and a signature block.`
      : `צור מכתב ערעור מקצועי לדוח חניה עם הפרטים הבאים:
        - מספר רישוי: ${formData.carNumber}
        - מספר דוח: ${formData.ticketNumber}
        - סוג העבירה: ${violationTypeText}
        - תאריך ושעת העבירה: ${formData.violationDate} ${formData.violationTime || ""}
        - מיקום: ${formData.violationLocation}
        - המערער ${formData.wasDriver === "yes" ? "היה" : "לא היה"} הנהג בזמן העבירה.
        - הרכב חנה ${formData.correctParking === "yes" ? "כראוי" : formData.correctParking === "partial" ? "באופן חלקי כראוי" : "לא כראוי"}.
        - השילוט היה ${formData.visibleSignage === "yes" ? "ברור ונראה" : formData.visibleSignage === "partial" ? "נראה באופן חלקי" : "לא נראה בבירור"}.
        - סיבת הערעור העיקרית: ${appealReasonText}
        
        ${formData.otherReason ? `- פרטים נוספים: ${formData.otherReason}` : ""}
        
        המכתב צריך להיות רשמי, מנומס ומשכנע. הוא צריך לכלול את פרטי הדוח, להסביר מדוע יש לבטל את הדוח בהתבסס על הסיבה שניתנה, ולבקש שהקנס יבוטל. פרמט אותו כמכתב ערעור נאות עם חלקים מתאימים וחתימה.`;

      // Call the AI to generate the letter
      const result = await InvokeLLM({
        prompt: prompt
      });
      
      if (result) {
        setFormData(prev => ({
          ...prev,
          generated_letter: result
        }));
        setCurrentGeneratedLetter(result);
      } else {
        throw new Error(t.errorMessages.generationFailed);
      }
    } catch (error) {
      console.error("Error generating appeal letter:", error);
      setErrors(prev => ({
        ...prev,
        generated_letter: t.errorMessages.generationFailed
      }));
    } finally {
      setGeneratingLetter(false);
    }
  };

  // Handle letter editing
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [editedLetter, setEditedLetter] = useState("");

  const handleEditLetter = () => {
    setEditedLetter(formData.generated_letter);
    setIsEditingLetter(true);
  };

  const handleSaveEditedLetter = () => {
    setFormData(prev => ({
      ...prev,
      generated_letter: editedLetter
    }));
    setIsEditingLetter(false);
  };

  // Navigate through steps
  const handleNext = () => {
    if (validateStep()) {
      // If moving to the letter generation step, generate the letter
      if (step === 5 && !formData.generated_letter) {
        generateAppealLetter();
      }
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error("Error submitting appeal:", error);
      setErrors(prev => ({
        ...prev,
        form: t.errorMessages.submissionFailed
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={scrollRef} className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            {step === 6 
              ? (language === 'en' ? "Review and Submit Appeal" : "סקירה והגשת הערעור")
              : (language === 'en' ? "Appeal Form - Step " : "טופס ערעור - שלב ") + step + "/6"}
          </CardTitle>
          <CardDescription>
            {/* Step-specific instructions */}
            {step === 1 && t.infos.step1}
            {step === 2 && t.infos.step2}
            {step === 3 && t.infos.step3}
            {step === 4 && t.infos.step4}
            {step === 5 && t.infos.step5}
            {step === 6 && t.infos.step6}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Step 1: Vehicle and Ticket Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-blue-600 mr-2" />
                  <Label htmlFor="carNumber" className="text-lg font-medium">{t.labels.carNumber}</Label>
                </div>
                <Input
                  id="carNumber"
                  name="carNumber"
                  placeholder={t.placeholders.carNumber}
                  value={formData.carNumber}
                  onChange={handleChange}
                  className={errors.carNumber ? "border-red-500" : ""}
                />
                {errors.carNumber && <p className="text-red-500 text-sm">{errors.carNumber}</p>}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <Label htmlFor="ticketNumber" className="text-lg font-medium">{t.labels.ticketNumber}</Label>
                </div>
                <Input
                  id="ticketNumber"
                  name="ticketNumber"
                  placeholder={t.placeholders.ticketNumber}
                  value={formData.ticketNumber}
                  onChange={handleChange}
                  className={errors.ticketNumber ? "border-red-500" : ""}
                />
                {errors.ticketNumber && <p className="text-red-500 text-sm">{errors.ticketNumber}</p>}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Ban className="w-5 h-5 text-blue-600 mr-2" />
                  <Label htmlFor="violationType" className="text-lg font-medium">{t.labels.violationType}</Label>
                </div>
                <Select
                  value={formData.violationType}
                  onValueChange={(value) => handleSelectChange("violationType", value)}
                >
                  <SelectTrigger className={errors.violationType ? "border-red-500" : ""}>
                    <SelectValue placeholder={language === 'en' ? "Select violation type" : "בחר סוג עבירה"} />
                  </SelectTrigger>
                  <SelectContent>
                    {t.violationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.violationType && <p className="text-red-500 text-sm">{errors.violationType}</p>}
              </div>
            </div>
          )}
          
          {/* Step 2: Violation Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <Label htmlFor="violationDate" className="text-lg font-medium">{t.labels.violationDate}</Label>
                </div>
                <Input
                  id="violationDate"
                  name="violationDate"
                  type="date"
                  value={formData.violationDate}
                  onChange={handleChange}
                  className={errors.violationDate ? "border-red-500" : ""}
                />
                {errors.violationDate && <p className="text-red-500 text-sm">{errors.violationDate}</p>}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <Label htmlFor="violationTime" className="text-lg font-medium">{t.labels.violationTime}</Label>
                </div>
                <Input
                  id="violationTime"
                  name="violationTime"
                  type="time"
                  value={formData.violationTime}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Map className="w-5 h-5 text-blue-600 mr-2" />
                  <Label htmlFor="violationLocation" className="text-lg font-medium">{t.labels.violationLocation}</Label>
                </div>
                <Input
                  id="violationLocation"
                  name="violationLocation"
                  placeholder={t.placeholders.violationLocation}
                  value={formData.violationLocation}
                  onChange={handleChange}
                  className={errors.violationLocation ? "border-red-500" : ""}
                />
                {errors.violationLocation && <p className="text-red-500 text-sm">{errors.violationLocation}</p>}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <Label htmlFor="ticketAmount" className="text-lg font-medium">{t.labels.ticketAmount}</Label>
                </div>
                <Input
                  id="ticketAmount"
                  name="ticketAmount"
                  placeholder={t.placeholders.ticketAmount}
                  value={formData.ticketAmount}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          
          {/* Step 3: Appeal Reason */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-medium">{t.labels.appealReason}</Label>
                <div className={`grid gap-3 ${errors.appealReason ? "border border-red-500 rounded-md p-3" : ""}`}>
                  <RadioGroup
                    value={formData.appealReason}
                    onValueChange={(value) => handleSelectChange("appealReason", value)}
                    className="space-y-2"
                  >
                    {t.appealReasons.map((reason) => (
                      <div key={reason.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value={reason.value} id={reason.value} />
                        <Label htmlFor={reason.value} className="font-normal">{reason.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {errors.appealReason && <p className="text-red-500 text-sm">{errors.appealReason}</p>}
              </div>
              
              {formData.appealReason === "other" && (
                <div className="space-y-4">
                  <Label htmlFor="otherReason" className="text-lg font-medium">{t.labels.otherReason}</Label>
                  <Textarea
                    id="otherReason"
                    name="otherReason"
                    placeholder={t.placeholders.otherReason}
                    value={formData.otherReason}
                    onChange={handleChange}
                    className={`min-h-32 ${errors.otherReason ? "border-red-500" : ""}`}
                  />
                  {errors.otherReason && <p className="text-red-500 text-sm">{errors.otherReason}</p>}
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Additional Details */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-medium">{t.labels.wasDriver}</Label>
                <div className={`${errors.wasDriver ? "border border-red-500 rounded-md p-3" : ""}`}>
                  <RadioGroup
                    value={formData.wasDriver}
                    onValueChange={(value) => handleSelectChange("wasDriver", value)}
                    className="flex space-x-4 rtl:space-x-reverse"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="yes" id="wasDriver-yes" />
                      <Label htmlFor="wasDriver-yes" className="font-normal">{t.labels.yesOption}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="no" id="wasDriver-no" />
                      <Label htmlFor="wasDriver-no" className="font-normal">{t.labels.noOption}</Label>
                    </div>
                  </RadioGroup>
                </div>
                {errors.wasDriver && <p className="text-red-500 text-sm">{errors.wasDriver}</p>}
              </div>
              
              <div className="space-y-4">
                <Label className="text-lg font-medium">{t.labels.correctParking}</Label>
                <div className={`${errors.correctParking ? "border border-red-500 rounded-md p-3" : ""}`}>
                  <RadioGroup
                    value={formData.correctParking}
                    onValueChange={(value) => handleSelectChange("correctParking", value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="yes" id="correctParking-yes" />
                      <Label htmlFor="correctParking-yes" className="font-normal">{t.labels.yesOption}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="no" id="correctParking-no" />
                      <Label htmlFor="correctParking-no" className="font-normal">{t.labels.noOption}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="partial" id="correctParking-partial" />
                      <Label htmlFor="correctParking-partial" className="font-normal">{t.labels.partialOption}</Label>
                    </div>
                  </RadioGroup>
                </div>
                {errors.correctParking && <p className="text-red-500 text-sm">{errors.correctParking}</p>}
              </div>
              
              <div className="space-y-4">
                <Label className="text-lg font-medium">{t.labels.visibleSignage}</Label>
                <div className={`${errors.visibleSignage ? "border border-red-500 rounded-md p-3" : ""}`}>
                  <RadioGroup
                    value={formData.visibleSignage}
                    onValueChange={(value) => handleSelectChange("visibleSignage", value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="yes" id="visibleSignage-yes" />
                      <Label htmlFor="visibleSignage-yes" className="font-normal">{t.labels.yesOption}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="no" id="visibleSignage-no" />
                      <Label htmlFor="visibleSignage-no" className="font-normal">{t.labels.noOption}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="partial" id="visibleSignage-partial" />
                      <Label htmlFor="visibleSignage-partial" className="font-normal">{t.labels.partialOption}</Label>
                    </div>
                  </RadioGroup>
                </div>
                {errors.visibleSignage && <p className="text-red-500 text-sm">{errors.visibleSignage}</p>}
              </div>
            </div>
          )}
          
          {/* Step 5: Document Upload */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FileImage className="w-5 h-5 text-blue-600 mr-2" />
                  <Label className="text-lg font-medium">{t.labels.documentUpload}</Label>
                </div>
                <p className="text-gray-500 text-sm">{t.labels.uploadFileHint}</p>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <FileImage className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">
                        {language === 'en' ? "Drag and drop files here, or" : "גרור ושחרר קבצים כאן, או"}
                      </p>
                      <div>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploadingFile}
                            onClick={() => document.getElementById("file-upload").click()}
                          >
                            {uploadingFile ? (
                              <>
                                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                                {t.labels.uploadingFile}
                              </>
                            ) : (
                              t.labels.uploadFile
                            )}
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="image/*,.pdf,.doc,.docx"
                            disabled={uploadingFile}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {fileErrors && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{language === 'en' ? "Error" : "שגיאה"}</AlertTitle>
                      <AlertDescription>{fileErrors}</AlertDescription>
                    </Alert>
                  )}
                  
                  {formData.documents.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="font-medium">
                          {language === 'en' ? "Uploaded Documents" : "מסמכים שהועלו"}
                        </h3>
                      </div>
                      <ul className="divide-y">
                        {formData.documents.map((doc, index) => (
                          <li key={index} className="p-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="text-sm truncate max-w-xs">{doc.name}</span>
                            </div>
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(doc.url, '_blank')}
                              >
                                {language === 'en' ? "View" : "צפה"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleRemoveFile(index)}
                              >
                                {t.labels.removeFile}
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 6: Generated Appeal */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <Label className="text-lg font-medium">{t.labels.generatedAppeal}</Label>
                </div>
                
                {!formData.generated_letter && !generatingLetter && (
                  <div className="border rounded-lg p-6 text-center">
                    <p className="text-gray-500 mb-4">{t.labels.generateAppealHint}</p>
                    <Button
                      type="button"
                      onClick={generateAppealLetter}
                      disabled={generatingLetter}
                    >
                      {t.labels.generateBtn}
                    </Button>
                  </div>
                )}
                
                {generatingLetter && (
                  <div className="border rounded-lg p-6 text-center">
                    <LoaderCircle className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">{t.labels.generatingLetter}</p>
                  </div>
                )}
                
                {formData.generated_letter && !isEditingLetter && !generatingLetter && (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-6 whitespace-pre-wrap bg-white">
                      {formData.generated_letter}
                    </div>
                    
                    <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleEditLetter}
                      >
                        {t.labels.editLetter}
                      </Button>
                      <Button 
                        type="button" 
                        onClick={generateAppealLetter}
                        disabled={generatingLetter}
                      >
                        {t.labels.updateLetter}
                      </Button>
                    </div>
                    
                    <p className="text-gray-500 text-sm">{t.labels.updateLetterHint}</p>
                  </div>
                )}
                
                {isEditingLetter && (
                  <div className="space-y-4">
                    <Textarea
                      value={editedLetter}
                      onChange={(e) => setEditedLetter(e.target.value)}
                      placeholder={t.placeholders.editLetter}
                      className="min-h-64"
                    />
                    
                    <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditingLetter(false)}
                      >
                        {language === 'en' ? "Cancel" : "ביטול"}
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleSaveEditedLetter}
                      >
                        {t.labels.saveChanges}
                      </Button>
                    </div>
                  </div>
                )}
                
                {errors.generated_letter && (
                  <p className="text-red-500 text-sm">{errors.generated_letter}</p>
                )}
              </div>
            </div>
          )}
          
          {/* General form error */}
          {errors.form && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{language === 'en' ? "Error" : "שגיאה"}</AlertTitle>
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={step === 1 ? () => navigate(createPageUrl("Landing")) : handleBack}
            disabled={loading}
          >
            {step === 1 ? (language === 'en' ? "Cancel" : "ביטול") : (
              <>
                {language === 'en' ? (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {t.labels.back}
                  </>
                ) : (
                  <>
                    {t.labels.back}
                    <ChevronRight className="w-4 h-4 mr-2" />
                  </>
                )}
              </>
            )}
          </Button>
          
          <Button
            type="button"
            onClick={step === 6 ? handleSubmit : handleNext}
            disabled={loading || generatingLetter || uploadingFile}
          >
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                {language === 'en' ? "Processing..." : "מעבד..."}
              </>
            ) : (
              <>
                {step === 6 ? t.labels.finish : (
                  <>
                    {language === 'en' ? (
                      <>
                        {t.labels.next}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        {t.labels.next}
                        <ChevronLeft className="w-4 h-4 mr-2" />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}