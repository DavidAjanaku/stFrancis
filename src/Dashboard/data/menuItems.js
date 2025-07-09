// data/menuItems.js
import { 
    Users, Calendar, MessageSquare, Heart, DollarSign, Mail, 
    Image, Settings, Home, Clock, Info, FileText, Camera,
    Church, Bell, BookOpen, MapPin, Phone, Globe
  } from 'lucide-react';
  
  export const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'homepage', label: 'Homepage', icon: Globe },
    { id: 'mass-schedule', label: 'Mass Schedule', icon: Clock },
    { id: 'about-us', label: 'About Us', icon: Info },
    { id: 'ministries', label: 'Ministries', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'liturgical', label: 'Liturgical Calendar', icon: BookOpen },
    { id: 'gallery', label: 'Photo Gallery', icon: Camera },
    { id: 'prayer-requests', label: 'Prayer Requests', icon: Heart },
        { id: 'post', label: 'Post', icon: Heart },

    { id: 'newsletters', label: 'Newsletter', icon: Mail },
    { id: 'contact', label: 'Contact Info', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];