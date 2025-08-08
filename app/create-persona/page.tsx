"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Question } from "@/types/persona";
import Link from "next/link";
import axios from "axios";
import { Spinner } from "@/components/ui/loader";


const STEPS = [
  { id: 1, title: "Basic Info", description: "Tell us about your persona" },
  { id: 2, title: "Personality", description: "Define their character" },
  {
    id: 3,
    title: "Questions & Answers",
    description: "Add conversation starters",
  },
  { id: 4, title: "Review", description: "Review and create" },
];

export default function CreatePersonaPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    accent: "",
    occupation: "",
    description: "",
    questions: [] as Question[],
  });
  const [loading, setLoading] = useState<boolean>(false);

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (!validateStep()) {
      alert("Please fill in all required fields before continuing.");
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (
    id: string,
    field: "question" | "answer",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));
  };

  const removeQuestion = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);

    try {
      setLoading(true);
      const response = await axios.post("/api/persona/create", formData);
      console.log(response);
      if (response.data.success) {
        setLoading(false);
        router.push("/");
      }
      setLoading(false)
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      return formData.name.trim() !== "" &&
             formData.accent.trim() !== "" &&
             formData.occupation.trim() !== "";
    }
    if (currentStep === 2) {
      return formData.description.trim() !== "";
    }
    if (currentStep === 3) {
      return formData.questions.length > 0 &&
             formData.questions.every(
               (q) => q.question.trim() !== "" && q.answer.trim() !== ""
             );
    }
    return true; // Step 4 is just review
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Persona Name</Label>
              <Input
                required
                id="name"
                placeholder="e.g., Leonardo da Vinci"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent">Accent/Language Style</Label>
              <Input
                required
                id="accent"
                placeholder="e.g., Italian Renaissance, Modern American"
                value={formData.accent}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, accent: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation/Role</Label>
              <Input
                required
                id="occupation"
                placeholder="e.g., Artist, Inventor, Scientist"
                value={formData.occupation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    occupation: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Persona Description</Label>
              <Textarea
                required={true}
                id="description"
                placeholder="Describe your persona's personality, background, and key characteristics..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Questions & Answers</h4>
              <Button onClick={addQuestion} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>

            {formData.questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>
                  No questions added yet. Click "Add Question" to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.questions.map((q, index) => (
                  <Card key={q.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">
                          Question {index + 1}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(q.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Input
                          placeholder="What would you ask this persona?"
                          value={q.question}
                          onChange={(e) =>
                            updateQuestion(q.id, "question", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Answer</Label>
                        <Textarea
                          placeholder="How would they respond?"
                          value={q.answer}
                          onChange={(e) =>
                            updateQuestion(q.id, "answer", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Review Your Persona</h4>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Name
                </Label>
                <p className="text-lg">{formData.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Accent
                </Label>
                <p>{formData.accent}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Occupation
                </Label>
                <p>{formData.occupation}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Description
                </Label>
                <p>{formData.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Questions
                </Label>
                <p>{formData.questions.length} questions added</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Persona
            </h1>
            <p className="text-gray-600">
              Follow the steps to create your custom persona
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {STEPS.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicator */}
          <div className="flex justify-between mb-8">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex-1 text-center ${
                  step.id <= currentStep ? "text-purple-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.id}
                </div>
                <p className="text-xs font-medium">{step.title}</p>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <Card>
            <CardHeader>
              <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {STEPS[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep === STEPS.length ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 px-2 text-white rounded-md"
              >
                {loading ? "Creating....." : "Create Persona"}
              </button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
