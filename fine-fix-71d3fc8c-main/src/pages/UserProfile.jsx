
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Save, 
  FileText, 
  Clock, 
  CheckCircle2, 
  X as XIcon,
  Shield,
  Edit,
  ChevronRight,
  AlertTriangle,
  FileBox,
  Trash2,
  LogOut,
  Settings,
  Bell,
  Lock,
  Info
} from "lucide-react";
import { User } from "@/api/entities";
import { Appeal } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAppeals, setUserAppeals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [savedFormData, setSavedFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    notification_preferences: {
      email: true,
      sms: false
    }
  });
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    notification_preferences: {
      email: true,
      sms: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await User.me();
        setUserData(user);
        
        const initialFormData = {
          full_name: user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          notification_preferences: {
            email: user.notification_preferences?.email !== false,
            sms: user.notification_preferences?.sms === true
          }
        };
        
        setFormData(initialFormData);
        setSavedFormData(initialFormData);
        
        const appeals = await Appeal.filter({ created_by: user.email });
        setUserAppeals(appeals);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNotificationPreferenceChange = (type, checked) => {
    setFormData({
      ...formData,
      notification_preferences: {
        ...formData.notification_preferences,
        [type]: checked
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(false);
    
    try {
      const updates = {};
      
      if (formData.full_name !== savedFormData.full_name) {
        updates.full_name = formData.full_name;
      }
      
      if (formData.phone !== savedFormData.phone) {
        updates.phone = formData.phone;
      }
      
      if (formData.address !== savedFormData.address) {
        updates.address = formData.address;
      }
      
      if (JSON.stringify(formData.notification_preferences) !== 
          JSON.stringify(savedFormData.notification_preferences)) {
        updates.notification_preferences = formData.notification_preferences;
      }
      
      if (Object.keys(updates).length > 0) {
        await User.updateMyUserData(updates);
        setSavedFormData(formData);
        setSaveSuccess(true);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(savedFormData);
    setIsEditing(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>טיוטה</span>
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>בטיפול</span>
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>אושר</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XIcon className="h-3 w-3" />
            <span>נדחה</span>
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-opacity-10 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar / User Info Card */}
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  {userData?.full_name ? (
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                      {userData.full_name.charAt(0)}
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <UserIcon className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <CardTitle className="text-center text-xl">{userData?.full_name || "משתמש"}</CardTitle>
              <CardDescription className="text-center">{userData?.email}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-2">
              <div className="text-sm">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="profile" className="flex-1">פרופיל</TabsTrigger>
                    <TabsTrigger value="settings" className="flex-1">הגדרות</TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile">
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{userData?.email || "לא צוין"}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{formData.phone || "לא צוין"}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{userAppeals.length} ערעורים</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{userData?.role || "משתמש"}</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="settings">
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">התראות במייל</span>
                        </div>
                        <Switch
                          checked={formData.notification_preferences.email}
                          onCheckedChange={(checked) => handleNotificationPreferenceChange('email', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">התראות SMS</span>
                        </div>
                        <Switch
                          checked={formData.notification_preferences.sms}
                          onCheckedChange={(checked) => handleNotificationPreferenceChange('sms', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center pt-2">
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? (
                            <span className="flex items-center">
                              <XIcon className="h-4 w-4 mr-2" />
                              ביטול
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Edit className="h-4 w-4 mr-2" />
                              עריכת פרופיל
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full" onClick={() => navigate(createPageUrl("Appeal"))}>
                <FileText className="h-4 w-4 mr-2" />
                ערעור חדש
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>פרטים אישיים</CardTitle>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    עריכה
                  </Button>
                )}
              </div>
              <CardDescription>עדכון פרטי הקשר שלכם</CardDescription>
            </CardHeader>
            <CardContent>
              {saveSuccess && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>פרטיך עודכנו בהצלחה</AlertTitle>
                  <AlertDescription>
                    הפרטים החדשים נשמרו במערכת.
                  </AlertDescription>
                </Alert>
              )}
              
              {saveError && (
                <Alert className="mb-4 bg-red-50 text-red-800 border-red-200" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>שגיאה בעדכון הפרטים</AlertTitle>
                  <AlertDescription>
                    אירעה שגיאה בעת עדכון הפרטים, אנא נסו שנית מאוחר יותר.
                  </AlertDescription>
                </Alert>
              )}
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">שם מלא</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="ישראל ישראלי"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">דוא"ל</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      placeholder="israel@example.com"
                      disabled={true} // Email cannot be changed
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="050-1234567"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">כתובת</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="הרצל 1, תל אביב"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>העדפות התראות</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="email-notifications"
                        checked={formData.notification_preferences.email}
                        onCheckedChange={(checked) => handleNotificationPreferenceChange('email', checked)}
                        disabled={!isEditing}
                      />
                      <Label htmlFor="email-notifications" className="cursor-pointer">קבלת עדכונים למייל</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="sms-notifications"
                        checked={formData.notification_preferences.sms}
                        onCheckedChange={(checked) => handleNotificationPreferenceChange('sms', checked)}
                        disabled={!isEditing}
                      />
                      <Label htmlFor="sms-notifications" className="cursor-pointer">קבלת עדכונים ב-SMS</Label>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  ביטול
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      שומר...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      שמירה
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>היסטוריית ערעורים</CardTitle>
              <CardDescription>רשימת הערעורים שהגשתם</CardDescription>
            </CardHeader>
            <CardContent>
              {userAppeals.length === 0 ? (
                <div className="text-center py-6">
                  <FileBox className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-gray-700">אין לכם ערעורים עדיין</h3>
                  <p className="text-gray-500 mt-1">התחילו בהגשת ערעור חדש עכשיו</p>
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate(createPageUrl("Appeal"))}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    ערעור חדש
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAppeals.map((appeal) => (
                    <motion.div
                      key={appeal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`${createPageUrl("Appeal")}?id=${appeal.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">דוח מספר: {appeal.ticket_number}</h3>
                            {getStatusBadge(appeal.appeal_status)}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            רכב מספר: {appeal.car_number}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            הוגש בתאריך: {formatDate(appeal.created_date)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {appeal.payment_status === "paid" ? (
                            <Badge className="bg-green-100 text-green-800">שולם</Badge>
                          ) : (
                            <Badge variant="outline">ממתין לתשלום</Badge>
                          )}
                          <ChevronRight className="h-5 w-5 ml-2 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מסמכים שמורים</CardTitle>
              <CardDescription>מסמכים ששמרתם במערכת</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <FileBox className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium text-gray-700">אין מסמכים שמורים</h3>
                <p className="text-gray-500 mt-1">המסמכים שתעלו בעת הגשת ערעור יישמרו כאן</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
