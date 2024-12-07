"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Crown, Archive, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";

interface ArchiveYear {
  year: number | string;
}

export default function ArchiveManager({
  classes,
  setMetaDataModal,
}: {
  classes?: string;
  setMetaDataModal: (param:boolean) => void;
}) {
  const archives: ArchiveYear[] = [
    { year: 2023 },
    { year: 2022 },
    { year: 2021 },
    { year: 2020 },
    { year: 2019 },
    { year: 2018 },
    { year: 2017 },
    { year: 2016 },
    { year: 2015 },
    { year: 2014 },
    { year: 2013 },
    { year: 2012 },
  ];

  const [activeYear, setActiveYear] = useState<string | number>(
    "2023_selection"
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleYearChange = (year: string) => {
    setActiveYear(isNaN(parseInt(year)) ? year : parseInt(year));
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const activeElement = scrollAreaRef.current.querySelector(
        `#archive-${activeYear}`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [activeYear]);

  return (
    <Card className={`w-full h-full ${classes}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Archives</span>
          <Button onClick={() => setMetaDataModal(true)} className="bg-transparent p-0 shadow-none hover:bg-transparent">
            <Plus className="w-20 h-20 text-blue-800" />
          </Button>
        </CardTitle>{" "}
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]">
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          <RadioGroup
            value={activeYear.toString()}
            onValueChange={handleYearChange}
            className="space-y-2 p-2"
          >
            {archives.slice(0, 4).map((archive) => (
              <div
                key={archive.year}
                className="flex items-center space-x-3 p-1 rounded-lg transition-colors hover:bg-gray-100"
              >
                <RadioGroupItem
                  value={archive.year.toString()}
                  id={`archive-${archive.year}`}
                  className="sr-only"
                />
                {archive.year === activeYear ? (
                  <Crown className="w-5 h-5 text-Caccent flex-shrink-0" />
                ) : (
                  <Archive className="w-5 h-5 text-Cprimary flex-shrink-0" />
                )}
                <Label
                  htmlFor={`archive-${archive.year}`}
                  className={`text-base flex-grow cursor-pointer ${
                    archive.year === activeYear
                      ? "text-Caccent font-semibold"
                      : "text-Cprimary"
                  }`}
                >
                  {typeof archive.year === "string"
                    ? archive.year.replace("_", " ")
                    : `${archive.year} Selection`}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
