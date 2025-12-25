import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
    title: string;
    description?: string;
    buttonText: string;
    buttonAction: () => void;
}

export function FeatureCard({
    title,
    description,
    buttonText,
    buttonAction,
}: FeatureCardProps) {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <Card className="w-[350px] mx-auto">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-center">{title}</CardTitle>
                    {/* {description && (
                        <CardDescription className="text-sm text-muted-foreground text-center">
                            {description}
                        </CardDescription>
                    )} */}
                </CardHeader>
                {/* {description && (
                    <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                            This feature allows you to {description.toLowerCase()}.
                        </p>
                    </CardContent>
                )} */}
                <CardFooter className="flex justify-center">
                    <Button
                        variant="default"
                        onClick={buttonAction}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {buttonText}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
