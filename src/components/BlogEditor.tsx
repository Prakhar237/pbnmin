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
    about: "",
    perfectFor: ["", "", "", "", ""],
    marketOpportunity: ["", "", "", "", ""],
    miniBlog: "",
    specialFeature1: "",
    specialFeature2: "",
  });

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

  const handleSave = async (publish: boolean = false) => {
    // Validate required fields
    if (!formData.domain || !formData.overview || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data, error } = await supabase.from("domain_listings").insert({
        domain: formData.domain,
        overview: formData.overview,
        price: formData.price,
        domain_age: parseInt(formData.domainAge) || 0,
        monthly_visits: parseInt(formData.monthlyVisits) || 0,
        seo_rating: formData.seoRating,
        about: formData.about,
        perfect_for: formData.perfectFor.filter((p) => p.trim() !== ""),
        market_opportunity: formData.marketOpportunity.filter((m) => m.trim() !== ""),
        mini_blog: formData.miniBlog,
        special_feature_1: formData.specialFeature1,
        special_feature_2: formData.specialFeature2,
      });

      if (error) throw error;

      toast.success(publish ? "Domain listing published!" : "Draft saved successfully!");
      
      // Reset form
      setFormData({
        domain: "",
        overview: "",
        price: "",
        domainAge: "",
        monthlyVisits: "",
        seoRating: "",
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
    }
  };

  const wordCount = formData.miniBlog.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Domain Editor</h1>
          <p className="text-muted-foreground">Create and publish domain listings</p>
        </div>

        <Card className="p-8 space-y-8">
          {/* Basic Information */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Primary domain details</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-base font-semibold">
                  Domain
                </Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={formData.domain}
                  onChange={(e) => handleInputChange("domain", e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overview" className="text-base font-semibold">
                  One Line Overview
                </Label>
                <Input
                  id="overview"
                  placeholder="A compelling description of the domain"
                  value={formData.overview}
                  onChange={(e) => handleInputChange("overview", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-base font-semibold">
                    Price
                  </Label>
                  <Input
                    id="price"
                    placeholder="$10,000"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domainAge" className="text-base font-semibold">
                    Domain Age (years)
                  </Label>
                  <Input
                    id="domainAge"
                    type="number"
                    placeholder="5"
                    value={formData.domainAge}
                    onChange={(e) => handleInputChange("domainAge", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyVisits" className="text-base font-semibold">
                    Monthly Visits
                  </Label>
                  <Input
                    id="monthlyVisits"
                    type="number"
                    placeholder="50000"
                    value={formData.monthlyVisits}
                    onChange={(e) => handleInputChange("monthlyVisits", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoRating" className="text-base font-semibold">
                  SEO Rating
                </Label>
                <Input
                  id="seoRating"
                  placeholder="8.5/10"
                  value={formData.seoRating}
                  onChange={(e) => handleInputChange("seoRating", e.target.value)}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* About Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">About</h2>
              <p className="text-sm text-muted-foreground">3-line description</p>
            </div>

            <Textarea
              placeholder="Enter a compelling 3-line description about this domain..."
              value={formData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </section>

          <Separator />

          {/* Perfect For */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Perfect For</h2>
              <p className="text-sm text-muted-foreground">5 bullet points</p>
            </div>

            <div className="space-y-3">
              {formData.perfectFor.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-3 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <Input
                    placeholder={`Point ${index + 1}`}
                    value={point}
                    onChange={(e) => handleArrayChange("perfectFor", index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Market Opportunity */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Market Opportunity</h2>
              <p className="text-sm text-muted-foreground">5 bullet points</p>
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
                <h2 className="text-2xl font-bold text-foreground mb-1">Mini Blog Content</h2>
                <p className="text-sm text-muted-foreground">Maximum 300 words</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {wordCount}/300 words
              </p>
            </div>

            <Textarea
              placeholder="Write your mini blog content here..."
              value={formData.miniBlog}
              onChange={(e) => handleInputChange("miniBlog", e.target.value)}
              className="min-h-[200px]"
            />
          </section>

          <Separator />

          {/* Special Features */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Special Features</h2>
              <p className="text-sm text-muted-foreground">Maximum 50 words each</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feature1" className="text-base font-semibold">
                  Special Feature 1
                </Label>
                <Textarea
                  id="feature1"
                  placeholder="Describe the first special feature..."
                  value={formData.specialFeature1}
                  onChange={(e) => handleInputChange("specialFeature1", e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.specialFeature1.trim().split(/\s+/).filter(Boolean).length}/50 words
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feature2" className="text-base font-semibold">
                  Special Feature 2
                </Label>
                <Textarea
                  id="feature2"
                  placeholder="Describe the second special feature..."
                  value={formData.specialFeature2}
                  onChange={(e) => handleInputChange("specialFeature2", e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.specialFeature2.trim().split(/\s+/).filter(Boolean).length}/50 words
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button onClick={() => handleSave(false)} className="flex-1" size="lg">
              <Save className="mr-2 h-5 w-5" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} variant="secondary" className="flex-1" size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Publish
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogEditor;
