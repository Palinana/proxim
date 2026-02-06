"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import MultiSelectPopoverSchedule from "./MultiSelectPopoverSchedule";

export default function StaffingForm({ staffing, admins, isSuperadmin, isPending }) {
    const [serviceType, setServiceType] = useState(staffing.serviceType || "");
    // const [status, setStatus] = useState(staffing.status || "");
    const [dob, setDob] = useState("");
    const [dobError, setDobError] = useState("");

    const [caseId, setCaseId] = useState(staffing.caseId || "");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState(staffing.location?.city || "Staten Island");
    const [state] = useState("NY");
    const [zipcode, setZipcode] = useState(staffing.location?.zipcode || "");

    const [workloadVisits, setWorkloadVisits] = useState(staffing.workload?.visits || "");
    const [workloadDuration, setWorkloadDuration] = useState(staffing.workload?.duration || "");
    const [workloadFreq, setWorkloadFreq] = useState(staffing.workload?.frequency || "Weekly");
    const [preferredSchedule, setPreferredSchedule] = useState(staffing.preferredSchedule || []);
    const [coordinatorId, setCoordinatorId] = useState("");

    const onlyNumbers = (value) => value.replace(/\D/g, "");

    const validateDOB = (value) => {
        // MM/DD/YYYY regex
        const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
        if (!regex.test(value)) return "format";
      
        const [m, d, y] = value.split("/").map(Number);
        const date = new Date(y, m - 1, d);
      
        // Check valid date (like 02/30)
        if (
            date.getFullYear() !== y ||
            date.getMonth() !== m - 1 ||
            date.getDate() !== d
        ) {
          return "format";
        }
      
        // Check future date
        const today = new Date();
        if (date > today) return "future";
      
        return "ok";
    };    

    const formatDOB = (value) => {
        const numbers = value.replace(/\D/g, "").slice(0, 8);
        const parts = [];
      
        if (numbers.length > 2) {
            parts.push(numbers.slice(0, 2));
            if (numbers.length > 4) {
                parts.push(numbers.slice(2, 4));
                parts.push(numbers.slice(4));
            } else {
                parts.push(numbers.slice(2));
            }
        } else {
            parts.push(numbers);
        }
      
        return parts.join("/");
    };    

    return (
        <div className="space-y-4">
            {/* Case */}
            <Input name="caseId" value={caseId} onChange={(e) => setCaseId(onlyNumbers(e.target.value))} placeholder="EI #" />

            {/* Age */}
            <Input
                name="dob"
                value={dob}
                onChange={(e) => setDob(formatDOB(e.target.value))}
                placeholder="MM/DD/YYYY"
            />

            {dobError && (
              <p className="text-xs text-red-600">{dobError}</p>
            )}

            {staffing.ageRange && (
                <p className="text-sm text-gray-500">
                    Current age: <span className="font-medium">{staffing.ageRange}</span>
                </p>
            )}

            {/* Location */}
            <Input name="street" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street address"/> 
            <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                    <SelectItem value="Staten Island">Staten Island</SelectItem>
                </SelectContent>
            </Select>

            {/* State fixed */}
            <Input name="state" value={state} readOnly />

            {/* Zipcode (numbers only) */}
            <Input
                name="zipcode"
                value={zipcode}
                onChange={(e) => setZipcode(onlyNumbers(e.target.value))}
                placeholder="Zipcode"
                maxLength={5}
            />
            
            <p className="text-xs text-muted-foreground">
                Street is used only to approximate location and is not saved.
            </p>

            {/* Coordinator for Superadmin */}
            {isSuperadmin && (
                <>
                  <Select value={coordinatorId} onValueChange={setCoordinatorId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Coordinator" />
                      </SelectTrigger>

                    <SelectContent className="bg-white">
                        {admins.map((a) => (
                          <SelectItem key={a.value} value={a.value}>
                            {a.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {/* hidden input for server action */}
                  <input type="hidden" name="coordinatorId" value={coordinatorId} />
                </>
            )}

            {/* Service Type */}
            <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="OT">OT</SelectItem>
                    <SelectItem value="PT">PT</SelectItem>
                    <SelectItem value="SI">SI</SelectItem>
                    <SelectItem value="ABA">ABA</SelectItem>
                </SelectContent>
            </Select>
            <input type="hidden" name="serviceType" value={serviceType} />

            {/* Workload */}
            <div className="grid grid-cols-3 gap-2">
              <Input
                  name="workloadVisits"
                  value={workloadVisits}
                  onChange={(e) => setWorkloadVisits(onlyNumbers(e.target.value))}
                  placeholder="# of Visits"
              />

              <Select value={workloadDuration} onValueChange={setWorkloadDuration}>
                  <SelectTrigger className="w-full">
                      <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                  </SelectContent>
              </Select>
              <input type="hidden" name="workloadDuration" value={workloadDuration} />

              <Select value={workloadFreq} onValueChange={setWorkloadFreq}>
                  <SelectTrigger className="w-full">
                      <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
              </Select>
              <input type="hidden" name="workloadFreq" value={workloadFreq} />
            </div>

          {/* Status */}
          {/* <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status"/>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          <input type="hidden" name="status" value={status} /> */}
       
            {/* Preferred Schedule */}
            <MultiSelectPopoverSchedule
                label="Preferred Schedule"
                options={[
                  { label: "Morning", value: "Morning" },
                  { label: "Afternoon", value: "Afternoon" },
                  { label: "Evening", value: "Evening" },
                  { label: "Any", value: "Any" },
                ]}
                value={preferredSchedule}
                onChange={setPreferredSchedule}
            />

            {preferredSchedule.map((val) => (
                <input key={val} type="hidden" name="preferredSchedule" value={val} />
            ))}

          <div className="flex justify-center mt-4">
              <Button 
                  type="submit" 
                  disabled={isPending}
                  onClick={(e) => {
                      const result = validateDOB(dob);
                  
                      if (result === "format") {
                          e.preventDefault();
                          setDobError("Invalid DOB format");
                      } else if (result === "future") {
                          e.preventDefault();
                          setDobError("DOB cannot be in the future");
                      } else {
                          setDobError("");
                      }
                  }}
              >
                  Save
              </Button>
          </div>
      </div>
    );
}
