import React from "react";

function Header() {
  return (
    <div>
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
                ZapShare
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
    </div>
  );
}

export default Header;
