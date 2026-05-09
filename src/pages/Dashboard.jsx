import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Globe, ShieldCheck } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/home/Hero';
import { TemplateGrid } from '../components/home/TemplateGrid';
import { DesignGrid } from '../components/home/DesignGrid';
import ExploreTab from '../components/home/ExploreTab';
import Projects from './Projects';
import Templates from './Templates';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { user } = useAuth();
  const navigate = useNavigate();


  const handleEditDesign = async (design, isTemplate = false) => {
    if (isTemplate) {
      try {
        // Use backend to store the template as a new design
        const response = await api.post('/designs', {
          title: `Copy of ${design.title}`,
          jsonData: design.konvaData || '[]',
          width: 800,
          height: 600
        });
        navigate(`/editor?id=${response.data.id}`);
      } catch (error) {
        console.error('Failed to create design from template:', error);
        // Fallback to local state if backend fails or is not connected
        navigate('/editor');
      }
    } else {
      navigate(`/editor?id=${design.id}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-700">
            <Hero />
            <TemplateGrid />
            <DesignGrid />
          </div>
        );
      case 'projects':
        return <Projects onEditDesign={(design) => handleEditDesign(design, false)} />;
      case 'templates':
        return <Templates onEditDesign={(template) => handleEditDesign(template, true)} />;
      case 'explore':
        return <ExploreTab />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-bold text-gray-400">Coming Soon</h2>
            <p className="text-gray-500">This feature is under development.</p>
          </div>
        );
    }
  };




  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
};

export default Dashboard;
