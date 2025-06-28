import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function FeaturesSection() {
  return (
    <section>
      <div className=" py-24">
        <div className="mx-auto w-full max-w-7xl  px-6">
          <div className=" flex flex-col justify-between md:flex-row md:gap-12">
            <div className="md:col-span-2">
              <h2 className="text-foreground text-balance text-4xl font-sans">
                The AI Coding Assistant that helps you write code faster
              </h2>
              <Button className="mt-8 pr-2" variant="outline" asChild></Button>
            </div>

            <div className="space-y-6 md:col-span-3 mt-10 md:mt-0 md:space-y-3">
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-foreground text-xl font-medium">
                    Invoicing
                  </h3>
                </div>
                <p className="text-muted-foreground mt-1 text-balance">
                  Just describe the code you want to write and we'll generate it
                  for you. From boilerplate code to complex business logic,
                  we've got you covered.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-foreground text-xl font-medium">
                    Expances Tracking
                  </h3>
                </div>
                <p className="text-muted-foreground mt-1 text-balance">
                  Get instant feedback on your code. Our AI will review your
                  code and suggest improvements in terms of best practices and
                  performance.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-foreground text-xl font-medium">
                    Client CRM
                  </h3>
                </div>
                <p className="text-muted-foreground mt-1 text-balance">
                  Get instant feedback on your code. Our AI will review your
                  code and suggest improvements in terms of best practices and
                  performance.
                </p>
              </div>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row gap-4 mt-12 ">
            <Card className=" p-2 flex-1">
              <div className="text-left mx-2 my-4">
                <h3 className="text-foreground text-lg font-medium mb-4">
                  AI Meeting Scheduler
                </h3>
                <div className="bg-gray-500 h-68 rounded-2xl"></div>
              </div>
            </Card>
            <Card className="p-2 flex-1">
              <div className="flex aspect-video items-center justify-center"></div>
              <div className="text-left ml-4 ">
                <h3 className="text-foreground text-lg font-medium">
                  AI Meeting Scheduler
                </h3>
                <p className="text-muted-foreground mt-4 ttext-balance text-base">
                  Effortlessly book and manage your meetings. Stay on top of
                  your schedule.
                </p>
              </div>
            </Card>
            <Card className="p-2 flex-1">
              <div className="flex aspect-video items-center justify-center"></div>
              <div className="text-left ml-4">
                <h3 className="text-foreground text-lg font-medium">
                  AI Meeting Scheduler
                </h3>
                <p className="text-muted-foreground mt-4 text-balance text-base">
                  Effortlessly book and manage your meetings. Stay on top of
                  your schedule.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
