"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Code,
  FileText,
  Link,
  Download,
  Eye,
  Folder,
  Clock,
  Share2,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Moon,
  Sun,
  Menu,
  ChevronRight,
  Zap,
  Shield,
  Users,
  Globe,
  Star,
  TrendingUp,
  Activity,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

export default function ShareCodeApp() {
  const { theme, setTheme } = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // handle code share states...
  const [editorCode, setEditorCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [shareCode, setShareCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");

  // handle file share states....
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");

  // Handle Share code...........................
  const handleUpload = async () => {
    try {
      if (!editorCode) {
        toast.error("Please enter some data before uploading.");
        return;
      }

      const res = await fetch(
        "https://smartshare-t3la.onrender.com/api/code-upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: editorCode,
            language: selectedLanguage,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setShareCode(result.data);
        toast.success("Code uploaded successfully!");
      } else {
        toast.error(result.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong while uploading.");
    }
  };

  const handleGet = async () => {
    if (!enteredCode) {
      toast.error("Please enter the code before retrieving.");
      return;
    }

    try {
      const res = await fetch(
        `https://smartshare-t3la.onrender.com/api/code-get/${enteredCode}`
      );
      const result = await res.json();

      if (res.ok) {
        setEditorCode(result.data);
        toast.success("Code retrieved successfully!");
      } else {
        toast.error(result.message || "Code not found.");
      }
    } catch (error) {
      console.error("Get error:", error);
      toast.error("Something went wrong while retrieving the code.");
    }
  };

  // Handle file share............................
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);

      const res = await fetch(
        "https://smartshare-t3la.onrender.com/api/upload-file",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      if (data.success) {
        setCode(data.data.toString());
        toast.success("File uploaded successfully!");
      } else {
        toast.error(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadByCode = async () => {
    if (!inputCode) {
      toast.error("Please enter a valid 4-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://smartshare-t3la.onrender.com/api/get-file",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: inputCode }),
        }
      );

      if (!res.ok) {
        toast.error("Download failed or file not found.");
        return;
      }

      const blob = await res.blob();

      // 👇 Get filename from header properly (handling encoding too)
      const contentDisposition = res.headers.get("Content-Disposition");
      let fileName = "downloaded-file";

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (match != null && match[1]) {
          fileName = match[1].replace(/['"]/g, "");
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during download.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const recentUploads = [
    {
      name: "auth.js",
      type: "JavaScript",
      size: "2.4 KB",
      time: "2 hours ago",
      views: 12,
      color: "bg-yellow-500",
    },
    {
      name: "database.sql",
      type: "SQL",
      size: "15.2 KB",
      time: "5 hours ago",
      views: 8,
      color: "bg-blue-500",
    },
    {
      name: "README.md",
      type: "Markdown",
      size: "1.1 KB",
      time: "1 day ago",
      views: 24,
      color: "bg-green-500",
    },
    {
      name: "config.json",
      type: "JSON",
      size: "892 B",
      time: "2 days ago",
      views: 5,
      color: "bg-purple-500",
    },
  ];

  const features = [
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Lightning Fast",
      description:
        "Upload and share files instantly with our optimized infrastructure",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Secure Sharing",
      description: "End-to-end encryption and customizable privacy controls",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with real-time collaboration features",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: "Global Access",
      description: "Access your files from anywhere with our global CDN",
      gradient: "from-purple-400 to-pink-500",
    },
  ];

  const quickStats = [
    {
      label: "Total Uploads",
      value: "127",
      icon: Upload,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Views",
      value: "2.3K",
      icon: Eye,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Active Links",
      value: "45",
      icon: Link,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Downloads",
      value: "892",
      icon: Download,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                  <Code className="h-6 w-6" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SmartShare
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {["Home", "Features", "Pricing", "Docs", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm font-medium text-white/80 hover:text-white transition-all duration-300 hover:scale-105 relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                  </a>
                )
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-white" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-white" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  className="text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  Login
                </Button>
                <Button className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                  Sign Up
                </Button>
              </div>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20"
                  >
                    <Menu className="h-5 w-5 text-white" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[400px] bg-slate-900/95 backdrop-blur-xl border-white/10"
                >
                  <nav className="flex flex-col space-y-4 mt-8">
                    {["Home", "Features", "Pricing", "Docs", "Contact"].map(
                      (item) => (
                        <a
                          key={item}
                          href="#"
                          className="text-lg font-medium text-white/80 hover:text-white transition-colors"
                        >
                          {item}
                        </a>
                      )
                    )}
                    <Separator className="bg-white/10" />
                    <Button
                      variant="ghost"
                      className="justify-start text-white/80 hover:text-white hover:bg-white/10"
                    >
                      Login
                    </Button>
                    <Button className="justify-start bg-gradient-to-r from-purple-500 to-pink-500">
                      Sign Up
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Share Your{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                  Code & Files
                </span>{" "}
                <br />
                Like Magic ✨
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience the future of file sharing with our lightning-fast,
                secure platform designed for modern developers and teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 transform"
                >
                  <Upload className="mr-2 h-6 w-6" />
                  Start Sharing
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <Code className="mr-2 h-6 w-6" />
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-105 animate-slide-in-left">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-purple-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Folder, label: "My Files", color: "text-blue-400" },
                  {
                    icon: Share2,
                    label: "Shared Links",
                    color: "text-green-400",
                  },
                  { icon: Clock, label: "Recent", color: "text-purple-400" },
                ].map((item, index) => (
                  <Button
                    key={item.label}
                    className="w-full justify-start h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white rounded-xl transition-all duration-300 hover:scale-105"
                    variant="ghost"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${item.color}`} />
                    {item.label}
                  </Button>
                ))}

                <Separator className="my-4 bg-white/10" />

                <div className="text-sm text-white/60">
                  <div className="flex items-center justify-between mb-3">
                    <span>Storage Used</span>
                    <span className="text-white/80 font-medium">21%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-1/5 animate-pulse"></div>
                  </div>
                  <p className="mt-2 text-xs text-white/50">2.1 GB of 10 GB</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 animate-slide-in-left animation-delay-200">
              {quickStats.map((stat, index) => (
                <Card
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upgrade Card */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 animate-slide-in-left animation-delay-400">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Star className="h-8 w-8 text-white animate-pulse" />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">
                  Go Premium
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  Unlock unlimited storage and advanced features
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Content */}
          <div className="xl:col-span-6 space-y-8">
            {/* Upload Zone */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 animate-slide-in-up">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold text-white flex items-center">
                  <Upload className="mr-3 h-8 w-8 text-purple-400" />
                  Upload & Share
                </CardTitle>
                <CardDescription className="text-lg text-white/70">
                  Drag, drop, and share your files in seconds
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-8">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 h-14 p-1 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <TabsTrigger
                      value="upload"
                      className="text-sm font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-xl transition-all duration-300 data-[state=active]:shadow-lg"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Files
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      className="text-sm font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-xl transition-all duration-300 data-[state=active]:shadow-lg"
                    >
                      <Code className="mr-2 h-5 w-5" />
                      Paste Code
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-0">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <img
                          src="/progress.gif"
                          alt="Loading..."
                          className="w-24 h-24 mb-4"
                        />
                        <p className="text-lg font-medium">
                          Processing your request, please wait...
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-500 ease-in-out ${
                          dragActive
                            ? "border-purple-400 bg-gradient-to-br from-purple-500/20 to-pink-500/20 scale-105 shadow-2xl shadow-purple-500/25"
                            : "border-white/30 hover:border-purple-400/50 hover:bg-white/5"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {/* Floating bubbles */}
                        <div className="absolute top-5 left-5 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
                        <div className="absolute top-10 right-10 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-10 left-10 w-5 h-5 bg-white/20 rounded-full animate-bounce"></div>

                        <h3 className="text-3xl font-bold text-white mb-2">
                          {dragActive
                            ? "Release to upload! 🚀"
                            : "Drop your files here"}
                        </h3>
                        <p className="text-white/70 mb-6 text-lg">
                          Or click to browse • Up to{" "}
                          <span className="font-bold text-purple-400">
                            50MB
                          </span>{" "}
                          per file
                        </p>

                        {/* File type badges */}
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                          {["JS", "HTML", "JSON", "PDF", "ZIP", "OTHERS"].map(
                            (type) => (
                              <span
                                key={type}
                                className="px-4 py-2 text-sm font-medium bg-white/10 text-white/80 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
                              >
                                {type}
                              </span>
                            )
                          )}
                        </div>

                        {/* File Choose Button + Code Box + Input */}
                        <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-4 mt-6">
                          {/* File Input */}
                          <div className="flex flex-col items-center">
                            <label className="cursor-pointer">
                              <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <div className="w-[160px] px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm text-center">
                                + Choose File
                              </div>
                            </label>

                            {selectedFile && (
                              <div className="mt-2 text-sm text-purple-300 font-mono text-center">
                                <p>{selectedFile.name}</p>
                                <button
                                  className="mt-1 text-red-400 hover:underline text-xs"
                                  onClick={() => setSelectedFile(null)}
                                  type="button"
                                >
                                  Remove file
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Generated Code Box */}
                          <div className="w-[160px] px-6 py-3 border border-purple-400 text-white-400 font-mono text-sm text-center rounded-xl bg-white/5 backdrop-blur-sm">
                            {code || "----"}
                          </div>

                          {/* Manual Code Input */}
                          <input
                            type="text"
                            placeholder="Enter code"
                            className="w-[160px] px-6 py-3 border border-purple-400 text-white-400 font-mono text-sm text-center rounded-xl bg-white/5 backdrop-blur-sm placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                          />
                        </div>

                        {/* Upload / Download Buttons */}
                        <div className="w-full max-w-3xl mx-auto px-4">
                          <div className="flex flex-col lg:flex-row justify-between gap-4 mt-6">
                            <Button
                              size="lg"
                              onClick={handleFileUpload}
                              className="w-full lg:w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                            >
                              <Upload className="mr-2 h-5 w-5" />
                              Upload File
                            </Button>

                            <Button
                              size="lg"
                              variant="outline"
                              onClick={handleDownloadByCode}
                              className="w-full lg:w-1/2 border border-white/30 text-white hover:bg-white/10 font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 bg-black"
                            >
                              <Download className="mr-2 h-5 w-5" />
                              Get File
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="code" className="mt-0">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Language Dropdown */}
                        <div className="col-span-2">
                          <label className="text-sm font-bold text-white mb-3 block">
                            Language
                          </label>
                          <select
                            className="w-full p-4 border border-white/20 rounded-2xl bg-white/10 backdrop-blur-sm text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            value={selectedLanguage}
                            onChange={(e) =>
                              setSelectedLanguage(e.target.value)
                            }
                          >
                            <option className="bg-slate-800">JavaScript</option>
                            <option className="bg-slate-800">Python</option>
                            <option className="bg-slate-800">TypeScript</option>
                            <option className="bg-slate-800">HTML</option>
                            <option className="bg-slate-800">CSS</option>
                            <option className="bg-slate-800">JSON</option>
                            <option className="bg-slate-800">OTHERS</option>
                          </select>
                        </div>

                        {/* Enter Code Box */}
                        <div>
                          <label className="text-sm font-bold text-white mb-3 block">
                            Enter Code to Retrieve
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            value={enteredCode}
                            onChange={(e) => setEnteredCode(e.target.value)}
                            placeholder="XXXX"
                            className="w-full h-[56px] p-4 border border-purple-400 text-white-400 font-mono text-xl text-center rounded-2xl bg-white/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                          />
                        </div>

                        {/* Your Share Code Box */}
                        <div>
                          <label className="text-sm font-bold text-white mb-3 block">
                            Your Share Code
                          </label>
                          <div className="w-full h-[56px] p-4 border border-purple-400 text-white-400 font-mono text-xl text-center rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center">
                            {shareCode || "----"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-white mb-3 block">
                          Your Code
                        </label>
                        <div className="relative">
                          <textarea
                            value={editorCode}
                            onChange={(e) => setEditorCode(e.target.value)}
                            className="w-full h-64 p-6 border border-white/20 rounded-2xl bg-white/10 backdrop-blur-sm font-mono text-sm text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-white/50"
                            placeholder={`// Paste your amazing code here...
function shareCode() {
  console.log('Welcome to SmartShare! 🚀');
}`}
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(editorCode);
                              toast.success("Code copied to clipboard!");
                            }}
                            className="absolute bottom-4 right-4 text-sm font-medium text-white bg-[#7F56D9] hover:bg-[#6D28D9] px-4 py-1 rounded-lg shadow-lg transition-all duration-200 border border-white/20"
                          >
                            Copy Code
                          </button>
                        </div>
                      </div>

                      {/* REPLACEMENT: Two buttons instead of one */}
                      <div className="w-full max-w-4xl mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-4 w-full">
                          <Button
                            onClick={handleUpload}
                            size="lg"
                            className="w-full lg:w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                          >
                            <Upload className="mr-2 h-6 w-6" />
                            Upload Code
                          </Button>

                          <Button
                            onClick={handleGet}
                            size="lg"
                            variant="outline"
                            className="w-full lg:w-1/2 border border-white/30 text-white hover:bg-white/10 font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
                          >
                            <Download className="mr-2 h-6 w-6" />
                            Get Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group animate-slide-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="font-bold text-white text-xl">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-3 animate-slide-in-right">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <TrendingUp className="mr-2 h-6 w-6 text-green-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-white/60">
                  Your latest uploads and shares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUploads.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${file.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-white/60 truncate">
                            {file.type} • {file.size} • {file.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-white/10 text-white/80 border-white/20"
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          {file.views}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10 rounded-lg"
                            >
                              <ChevronRight className="h-4 w-4 text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-800/95 backdrop-blur-xl border-white/10"
                          >
                            <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                              <Link className="mr-2 h-4 w-4" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                  <Code className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SmartShare
                </span>
              </div>
              <p className="text-white/70 mb-6 max-w-md leading-relaxed">
                The most beautiful and secure way to share code and files. Built
                with love for developers worldwide.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/SUJALGPM"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </a>
                <a
                  href="https://www.linkedin.com/in/sujal-dingankar-3094ba289"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </a>
                <a
                  href="mailto:Mailme.sujaldingankar@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {["Features", "Pricing", "API", "Integrations"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-white/70">
                {["Help Center", "Terms", "Privacy", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-white/60">
            <p>© 2024 SmartShare. Crafted with magic ✨</p>
            <p>Made for developers, by Sujal Dingankar 💜</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        .animation-delay-3000 {
          animation-delay: 3000ms;
        }
        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
      `}</style>

      <Toaster position="top-right" />
    </div>
  );
}
