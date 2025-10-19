import { BodyFeeling } from "../../components/bodyFeeling/BodyFeeling";
import { CardContainer } from "../../components/cardContainer/CardContainer";
import { Habits } from "../../components/habits/Habits";
import { Mood } from "../../components/mood/Mood";

export const Homepage = () => {
    return (
        <div className="flex flex-col gap-4 pt-[48px] p-4">
            <CardContainer>
                <Habits />
            </CardContainer>

            <CardContainer>
                <Mood />
            </CardContainer>

            <CardContainer>
                <BodyFeeling />
            </CardContainer>
        </div>
    );
};
