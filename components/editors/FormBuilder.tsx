"use client";

import { FormBlockContent } from "@/types/landing-page";
import { Plus, Trash2, GripVertical, Settings2 } from "lucide-react";
import { useState } from "react";

interface FormBuilderProps {
  content: FormBlockContent;
  onChange: (content: FormBlockContent) => void;
}

export default function FormBuilder({ content, onChange }: FormBuilderProps) {
  const fields = content.fields || [];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addField = (type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox") => {
    const newField = {
      name: `field_${fields.length + 1}`,
      label: `New ${type === "textarea" ? "Text Area" : type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      type,
      required: false,
      placeholder: "",
    };
    onChange({ ...content, fields: [...fields, newField] });
  };

  const removeField = (index: number) => {
    onChange({ ...content, fields: fields.filter((_, i) => i !== index) });
  };

  const updateField = (index: number, updates: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    onChange({ ...content, fields: newFields });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newFields = [...fields];
    const [draggedField] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, draggedField);
    onChange({ ...content, fields: newFields });
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Form Settings */}
      <div className="space-y-3 pb-4 border-b border-gray-200">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Submit Button Text
          </label>
          <input
            type="text"
            value={content.submitButtonText || "Submit"}
            onChange={(e) => onChange({ ...content, submitButtonText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Submit"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Success Message
          </label>
          <input
            type="text"
            value={content.successMessage || "Thank you for your submission!"}
            onChange={(e) => onChange({ ...content, successMessage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Thank you for your submission!"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email Notification (optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="email"
              value={content.emailNotification?.to || ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  emailNotification: { ...content.emailNotification, to: e.target.value } as any,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            <input
              type="text"
              value={content.emailNotification?.subject || ""}
              onChange={(e) =>
                onChange({
                  ...content,
                  emailNotification: {
                    to: content.emailNotification?.to || "",
                    subject: e.target.value,
                  },
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email subject"
            />
          </div>
        </div>
      </div>

      {/* Field Types */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Add Field Type</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { type: "text", label: "Text" },
            { type: "email", label: "Email" },
            { type: "phone", label: "Phone" },
            { type: "textarea", label: "Text Area" },
            { type: "select", label: "Dropdown" },
            { type: "checkbox", label: "Checkbox" },
          ].map((fieldType) => (
            <button
              key={fieldType.type}
              onClick={() => addField(fieldType.type as any)}
              className="px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
            >
              {fieldType.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-700">Form Fields</label>
          <span className="text-xs text-gray-500">{fields.length} fields</span>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm">No fields yet</p>
            <p className="text-xs mt-1">Click a field type above to add form fields</p>
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="border border-gray-200 rounded-lg p-3 bg-white space-y-2 cursor-move hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400 mt-2" />
                  <div className="flex-1 space-y-2">
                    {/* Field Name & Type */}
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Field label"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateField(index, { type: e.target.value })}
                        className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="textarea">Text Area</option>
                        <option value="select">Dropdown</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>

                    {/* Field Name (ID) & Placeholder */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(index, { name: e.target.value })}
                        className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="field_name"
                      />
                      <input
                        type="text"
                        value={field.placeholder || ""}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Placeholder text"
                      />
                    </div>

                    {/* Options for Select/Checkbox */}
                    {(field.type === "select" || field.type === "checkbox") && (
                      <div>
                        <input
                          type="text"
                          value={field.options?.join(", ") || ""}
                          onChange={(e) =>
                            updateField(index, {
                              options: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Options (comma separated)"
                        />
                      </div>
                    )}

                    {/* Required Toggle */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={field.required || false}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`required-${index}`} className="text-xs text-gray-700">
                        Required field
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => removeField(index)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
