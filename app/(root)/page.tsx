import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/ui/InterviewCard";
import {getCurrentUser, getInterviewsByUserId, getLatestInterviews} from "@/lib/actions/auth.action";
import {promise} from "zod";

const Page = async () => {
    const user = await getCurrentUser();

    const [] = await Promise.all([
        await getInterviewsByUserId(user?.id),
    await getLatestInterviews({ userId: user?.id! })
    ]);

    const userInterviews = await getInterviewsByUserId(user?.id);
    const latestinterviews = await getLatestInterviews({    userId: user?.id! });

    const hasPastInterviews = userInterviews?.length > 0;
    const hasUpcomingInterviews = latestinterviews?.length > 0;

    return (
        <>
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with <br/>AI-Powerd Practie & Feedback</h2>
                    <p className="text-lg">Pratice on real interview question & get instant feedback</p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Start an Interview</Link>
                    </Button>
                </div>
                <Image src="/robot.png" alt="robo-dude" width={400} height={400} className="max-sm:hidden" />
            </section>
            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>
                <div className="interviews-section">

                    {
                        hasPastInterviews ? (
                            userInterviews?.map((interview) => (
                                <InterviewCard {...interview} key={interview.id} />
                            ))): (
                                <p>you have &apos;t taken any interviews yet </p>
                        )
                    }

                </div>
            </section>
            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an Interview</h2>
                <div className="interviews-section">
                    {
                       hasUpcomingInterviews ? (
                            latestinterviews?.map((interview) => (
                                <InterviewCard {...interview} key={interview.id} />
                            ))): (
                            <p>There are no interview avaible</p>
                        )
                    }
                </div>
            </section>
        </>
    )
}

export default Page