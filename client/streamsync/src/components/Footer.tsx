import React from 'react';
import { 
  Tv, 
  Play, 
  Heart, 
  Star, 
  Download, 
  Settings, 
  HelpCircle, 
  Shield, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Smartphone,
  Monitor,
  Tablet,
  Globe
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    streaming: [
      { name: 'Live TV', icon: Play },
      { name: 'Movies', icon: Star },
      { name: 'Series', icon: Heart },
      { name: 'Downloads', icon: Download },
      { name: 'Watchlist', icon: Heart }
    ],
    support: [
      { name: 'Help Center', icon: HelpCircle },
      { name: 'Contact Us', icon: Mail },
      { name: 'Device Setup', icon: Settings },
      { name: 'Troubleshooting', icon: Settings },
      { name: 'System Status', icon: Globe }
    ],
    company: [
      { name: 'About Us', icon: null },
      { name: 'Careers', icon: null },
      { name: 'Press', icon: null },
      { name: 'Investors', icon: null },
      { name: 'Blog', icon: null }
    ],
    legal: [
      { name: 'Privacy Policy', icon: Shield },
      { name: 'Terms of Service', icon: null },
      { name: 'Cookie Policy', icon: null },
      { name: 'Accessibility', icon: null },
      { name: 'Content Guidelines', icon: null }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'YouTube', icon: Youtube, url: '#' }
  ];

  const devicePlatforms = [
    { name: 'Fire TV', icon: Tv },
    { name: 'Mobile', icon: Smartphone },
    { name: 'Desktop', icon: Monitor },
    { name: 'Tablet', icon: Tablet }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section - Brand and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">StreamSync</h3>
                <p className="text-slate-400 text-sm">Premium Streaming Experience</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Stream your favorite content across all your devices. Enjoy unlimited movies, series, and live TV with crystal-clear 4K quality.
            </p>
            
            {/* Available Platforms */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Available On</h4>
              <div className="flex space-x-3">
                {devicePlatforms.map((platform) => (
                  <div 
                    key={platform.name}
                    className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer"
                  >
                    <platform.icon className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">{platform.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl p-6 border border-slate-700/50">
              <h4 className="text-xl font-semibold text-white mb-2">Stay Updated</h4>
              <p className="text-slate-300 mb-4">Get the latest updates on new releases, features, and exclusive content.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Streaming Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <Play className="w-4 h-4 text-blue-400" />
              <span>Streaming</span>
            </h4>
            <ul className="space-y-3">
              {footerLinks.streaming.map((link) => (
                <li key={link.name}>
                  <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 group">
                    {link.icon && <link.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />}
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Support</span>
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 group">
                    {link.icon && <link.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />}
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button className="text-slate-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Legal</span>
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 group">
                    {link.icon && <link.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />}
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-800/30 rounded-2xl p-6 mb-8 border border-slate-700/50">
          <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white">support@streamsync.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Phone</p>
                <p className="text-white">1-800-STREAM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Address</p>
                <p className="text-white">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-slate-400 text-sm">
              © {currentYear} StreamSync. All rights reserved. | Made with ❤️ for streaming enthusiasts
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-slate-500 text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 hover:rotate-3"
                  title={social.name}
                >
                  <social.icon className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;