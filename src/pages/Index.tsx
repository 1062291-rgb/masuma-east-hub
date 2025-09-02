// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-gradient">MASUMA East Africa</h1>
      <p className="text-xl text-muted-foreground mb-6">Professional Auto Parts Inventory & POS System</p>
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 gradient-primary text-white rounded-lg shadow-glow hover:scale-105 transition-bounce font-semibold"
        >
          Launch Dashboard
        </button>
      </div>
    </div>
  </div>
  );
};

export default Index;
