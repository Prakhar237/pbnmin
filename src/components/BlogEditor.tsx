import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlogFormData {
  domain: string;
  overview: string;
  price: string;
  domainAge: string;
  monthlyVisits: string;
  seoRating: string;
  backlinkCounter: string;
  screenshots: File[];
  about: string;
  perfectFor: string[];
  marketOpportunity: string[];
  miniBlog: string;
  specialFeature1: string;
  specialFeature2: string;
}

const BlogEditor = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    domain: "",
    overview: "",
    price: "",
    domainAge: "",
    monthlyVisits: "",
    seoRating: "",
    backlinkCounter: "",
    screenshots: [],
    about: "",
    perfectFor: ["", "", "", "", ""],
    marketOpportunity: ["", "", "", "", ""],
    miniBlog: "",
    specialFeature1: "",
    specialFeature2: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof BlogFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: "perfectFor" | "marketOpportunity",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 2) {
      toast.error("Maximum 2 screenshots allowed");
      return;
    }
    setFormData((prev) => ({ ...prev, screenshots: files }));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!formData.domain || !formData.overview || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Upload screenshots to storage
      const screenshotUrls: string[] = [];
      
      for (const file of formData.screenshots) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('screenshots')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('screenshots')
          .getPublicUrl(filePath);

        screenshotUrls.push(publicUrl);
      }

      const { data, error } = await supabase.from("domain_listings").insert({
        domain: formData.domain,
        overview: formData.overview,
        price: formData.price,
        domain_age: parseInt(formData.domainAge) || 0,
        monthly_visits: parseInt(formData.monthlyVisits) || 0,
        seo_rating: formData.seoRating,
        backlink_counter: parseInt(formData.backlinkCounter) || 0,
        screenshot_urls: screenshotUrls,
        about: formData.about,
        perfect_for: formData.perfectFor.filter((p) => p.trim() !== ""),
        market_opportunity: formData.marketOpportunity.filter((m) => m.trim() !== ""),
        mini_blog: formData.miniBlog,
        special_feature_1: formData.specialFeature1,
        special_feature_2: formData.specialFeature2,
      });

      if (error) throw error;

      toast.success(publish ? "Domain listing published!" : "Draft saved successfully!");
      
      setFormData({
        domain: "",
        overview: "",
        price: "",
        domainAge: "",
        monthlyVisits: "",
        seoRating: "",
        backlinkCounter: "",
        screenshots: [],
        about: "",
        perfectFor: ["", "", "", "", ""],
        marketOpportunity: ["", "", "", "", ""],
        miniBlog: "",
        specialFeature1: "",
        specialFeature2: "",
      });
    } catch (error) {
      console.error("Error saving domain listing:", error);
      toast.error("Failed to save domain listing");
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = formData.miniBlog.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-7xl font-black mb-4 text-foreground font-spartan tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            Domain Publisher
          </h1>
          <p className="text-xl text-muted-foreground font-poppins font-light">Craft premium domain listings with precision</p>
        </div>

        <Card className="p-12 space-y-10 shadow-2xl border-2 backdrop-blur-sm bg-card/95">
          {/* Basic Information */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 font-spartan border-b-2 border-primary/20 pb-3">Basic Information</h2>
              <p className="text-sm text-muted-foreground font-poppins">Primary domain details</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                  Domain
                </Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={formData.domain}
                  onChange={(e) => handleInputChange("domain", e.target.value)}
                  className="text-lg font-poppins"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overview" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                  One Line Overview
                </Label>
                <Input
                  id="overview"
                  placeholder="A compelling description of the domain"
                  value={formData.overview}
                  onChange={(e) => handleInputChange("overview", e.target.value)}
                  className="font-poppins"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                    Price
                  </Label>
                  <Input
                    id="price"
                    placeholder="$10,000"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="font-poppins"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domainAge" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                    Domain Age (years)
                  </Label>
                  <Input
                    id="domainAge"
                    type="number"
                    placeholder="5"
                    value={formData.domainAge}
                    onChange={(e) => handleInputChange("domainAge", e.target.value)}
                    className="font-poppins"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyVisits" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                    Monthly Visits
                  </Label>
                  <Input
                    id="monthlyVisits"
                    type="number"
                    placeholder="50000"
                    value={formData.monthlyVisits}
                    onChange={(e) => handleInputChange("monthlyVisits", e.target.value)}
                    className="font-poppins"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoRating" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                  SEO Rating
                </Label>
                <Input
                  id="seoRating"
                  placeholder="8.5/10"
                  value={formData.seoRating}
                  onChange={(e) => handleInputChange("seoRating", e.target.value)}
                  className="font-poppins"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backlinkCounter" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                  Backlink Counter
                </Label>
                <Input
                  id="backlinkCounter"
                  type="number"
                  placeholder="Enter number of backlinks"
                  value={formData.backlinkCounter}
                  onChange={(e) => handleInputChange("backlinkCounter", e.target.value)}
                  className="font-poppins"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshots" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                  3rd Party Screenshots (Max 2)
                </Label>
                <Input
                  id="screenshots"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="font-poppins"
                />
                {formData.screenshots.length > 0 && (
                  <p className="text-xs text-muted-foreground font-poppins">
                    {formData.screenshots.length} file(s) selected
                  </p>
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* About Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 font-spartan border-b-2 border-primary/20 pb-3">About</h2>
              <p className="text-sm text-muted-foreground font-poppins">3-line description</p>
            </div>

            <Textarea
              placeholder="Enter a compelling 3-line description about this domain..."
              value={formData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
              className="min-h-[100px] resize-none font-poppins"
            />
          </section>

          <Separator />

          {/* Perfect For */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 font-spartan border-b-2 border-primary/20 pb-3">Perfect For</h2>
              <p className="text-sm text-muted-foreground font-poppins">5 bullet points</p>
            </div>

            <div className="space-y-3">
              {formData.perfectFor.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-3 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <Input
                    placeholder={`Point ${index + 1}`}
                    value={point}
                    onChange={(e) => handleArrayChange("perfectFor", index, e.target.value)}
                    className="font-poppins"
                  />
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Market Opportunity */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 font-spartan border-b-2 border-primary/20 pb-3">Market Opportunity</h2>
              <p className="text-sm text-muted-foreground font-poppins">5 bullet points</p>
            </div>

            <div className="space-y-3">
              {formData.marketOpportunity.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-3 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <Input
                    placeholder={`Opportunity ${index + 1}`}
                    value={point}
                    onChange={(e) =>
                      handleArrayChange("marketOpportunity", index, e.target.value)
                    }
                    className="font-poppins"
                  />
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Mini Blog Content */}
          <section className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2 font-spartan border-b-2 border-primary/20 pb-3">Mini Blog Content</h2>
                <p className="text-sm text-muted-foreground font-poppins">Maximum 300 words</p>
              </div>
              <p className="text-sm text-muted-foreground font-poppins">
                {wordCount}/300 words
              </p>
            </div>

            <Textarea
              placeholder="Write your mini blog content here..."
              value={formData.miniBlog}
              onChange={(e) => handleInputChange("miniBlog", e.target.value)}
              className="min-h-[200px] font-poppins"
            />
          </section>

          <Separator />

          {/* Special Features */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 font-spartan border-b-2 border-primary/20 pb-3">Special Features</h2>
              <p className="text-sm text-muted-foreground font-poppins">Maximum 50 words each</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feature1" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                  Special Feature 1
                </Label>
                <Textarea
                  id="feature1"
                  placeholder="Describe the first special feature..."
                  value={formData.specialFeature1}
                  onChange={(e) => handleInputChange("specialFeature1", e.target.value)}
                  className="min-h-[100px] resize-none font-poppins"
                />
                <p className="text-xs text-muted-foreground text-right font-poppins">
                  {formData.specialFeature1.trim().split(/\s+/).filter(Boolean).length}/50 words
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feature2" className="font-montserrat font-semibold text-sm uppercase tracking-wide">
                  Special Feature 2
                </Label>
                <Textarea
                  id="feature2"
                  placeholder="Describe the second special feature..."
                  value={formData.specialFeature2}
                  onChange={(e) => handleInputChange("specialFeature2", e.target.value)}
                  className="min-h-[100px] resize-none font-poppins"
                />
                <p className="text-xs text-muted-foreground text-right font-poppins">
                  {formData.specialFeature2.trim().split(/\s+/).filter(Boolean).length}/50 words
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-6 pt-8">
            <Button 
              onClick={() => handleSave(false)} 
              className="flex-1 h-14 text-lg font-montserrat font-semibold tracking-wide hover:scale-105 transition-transform" 
              size="lg"
              variant="outline"
              disabled={isLoading}
            >
              <Save className="mr-2 h-5 w-5" />
              {isLoading ? "Saving..." : "Save Draft"}
            </Button>
            <Button 
              onClick={() => handleSave(true)} 
              className="flex-1 h-14 text-lg font-montserrat font-bold tracking-wide hover:scale-105 transition-transform shadow-lg" 
              size="lg"
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogEditor;