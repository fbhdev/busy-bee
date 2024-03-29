import {FormEvent, useEffect, useState} from "react";
import {useQuery} from "react-query";
import {CSSTransition} from "react-transition-group";
import Input from "./Input";
import Button from "./Button";

interface CareerProps {
    id: number;
    applied: string;
    title: string;
    location: string;
    employer: string;
    description: string;
    url: string;
}

interface LocationProps {
    name: string;
    value: number;
}

interface InputProps {
    name: string;
    type: string;
    placeholder: string;
}

interface Certification {
    elapsed: number;
    rounded: number;
}


// icons
const INSIGHT_ICON_COLOR: string = "F6BD60";
const INSIGHT_ICON_SIZE: string = "24";
const CALENDAR_ICON: string = `https://img.icons8.com/ios/${INSIGHT_ICON_SIZE}/${INSIGHT_ICON_COLOR}/clock--v1.png`;
const MARKER_ICON: string = `https://img.icons8.com/ios/${INSIGHT_ICON_SIZE}/${INSIGHT_ICON_COLOR}/place-marker--v1.png`;
const APPS_ICON: string = `https://img.icons8.com/ios/${INSIGHT_ICON_SIZE}/${INSIGHT_ICON_COLOR}/overview-pages-3.png`;
const GRAD_ICON: string = `https://img.icons8.com/pastel-glyph/${INSIGHT_ICON_SIZE}/${INSIGHT_ICON_COLOR}/graduation-cap--v3.png`;
const RATIO_ICON: string = `https://img.icons8.com/external-outlines-amoghdesign/${INSIGHT_ICON_SIZE}/${INSIGHT_ICON_COLOR}/external-analysis-education-vol-01-outlines-amoghdesign.png`;
const REMOTE_ICON: string = `https://img.icons8.com/ios/${INSIGHT_ICON_COLOR}/${INSIGHT_ICON_SIZE}/imac.png`;
const RESET_ICON: string = `https://img.icons8.com/ios/${INSIGHT_ICON_SIZE}/${INSIGHT_ICON_COLOR}/recurring-appointment.png`;

// grad date
const YOUR_GRADUATION: string = "2022-12-14";

// endpoints
const post_headers = {
    'Content-Type': 'application/json'
}

const CACHE = {
    cacheTime: 60 * 60 * 1000 * 24,
    refetchOnWindowFocus: false
};

enum METHODS {
    POST = "POST"
}

enum endpoints {
    CAREERS = "http://localhost:8000/v1/careers/",
    REMOTE = "http://localhost:8000/v1/careers/remote",
    LOCATIONS = "http://localhost:8000/v1/careers/data/locations"
}

enum queryKeys {
    CAREERS = "careers",
    REMOTE = "remote",
    LOCATIONS = "locations"
}

const LOCKED = <img src="https://img.icons8.com/ios-glyphs/24/F6BD60/lock--v1.png" alt={"padlock"}/>;
const UNLOCKED = <img src="https://img.icons8.com/material/24/F6BD60/checkmark--v1.png" alt={"unlock"}/>
const MESSAGE_DELAY = 2000;

const input: InputProps[] = [
    {name: "title", type: "text", placeholder: "Title"},
    {name: "location", type: "text", placeholder: "Location"},
    {name: "employer", type: "text", placeholder: "Employer"},
    {name: "description", type: "text", placeholder: "Description"},
    {name: "url", type: "text", placeholder: "URL"}
];

export default function Insert(): JSX.Element {

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function GET(endpoint: string): Promise<any> {
        const response = await fetch(endpoint);
        return await response.json();
    }

    const {
        isLoading: isLoadingCareers,
        data: dataResults,
        refetch: refetchCareers
    } = useQuery<CareerProps[]>(queryKeys.CAREERS, () => GET(endpoints.CAREERS), CACHE);
    const {
        isLoading: isLoadingLocations,
        data: dataLocations,
        refetch: refetchLocations
    } = useQuery<LocationProps>(queryKeys.LOCATIONS, () => GET(endpoints.LOCATIONS), CACHE);
    const {
        isLoading: isLoadingRemote,
        data: dataRemote,
        refetch: refetchRemote
    } = useQuery<number>(queryKeys.REMOTE, () => GET(endpoints.REMOTE), CACHE);

    useEffect(() => {
        if (isSubmitting) {
            refetchLocations();
            refetchRemote();
        }
    }, [isSubmitting, refetchLocations, refetchRemote]);

    function getCurrentDate(): string {
        const date = new Date();
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    function completedCertification(gradDate: string): Certification {
        const date = new Date();
        const targetDate = new Date(gradDate);
        const timeElapsed = date.getTime() - targetDate.getTime();
        const daysElapsed = timeElapsed / (1000 * 60 * 60 * 24);
        const roundedDaysElapsed = Number(daysElapsed.toFixed(2));
        return {elapsed: daysElapsed, rounded: roundedDaysElapsed};
    }

    function Message(): JSX.Element {
        return (
            <div className={"message"}>
                <p id={"insert-message"}></p>
            </div>
        );
    }

    function changeMessage(message: string): void {
        const mess = document.getElementById("insert-message") as HTMLDivElement;
        if (message) {
            mess!.innerHTML = message;
        }
    }

    function activeMessage(bool = false): void {
        const message = document.getElementsByClassName("message")[0];
        if (!bool) message.classList.remove("active");
        else {
            message.classList.add("active");
            setTimeout(() => {
                message.classList.remove("active");
                changeMessage("");
            }, MESSAGE_DELAY);
        }
    }

    function Header(): JSX.Element {

        if (isLoadingCareers || isLoadingLocations || isLoadingRemote) {
            return (
                <div id={"insert-header"}>
                    <div id={"insert-header-wrapper"}>
                        <h3 id={'loading'}>{"Loading..."}</h3>
                    </div>
                </div>
            );
        }

        const gradDate: Certification = completedCertification(YOUR_GRADUATION);
        const currentDate: string = getCurrentDate();

        function Insight(props: { title: string, img: { link: string, alt: string } }): JSX.Element {
            return (
                <div className="insight">
                    <img src={props.img.link} alt={props.img.alt}/>
                    <h2>{props.title}</h2>
                </div>
            );
        }

        return (
            <div id={"insert-header"}>
                <Insight title={currentDate} img={{link: CALENDAR_ICON, alt: "calendar"}}/>
                <Insight title={`Most Applied: ${dataLocations?.name}, ${dataLocations?.value}`}
                         img={{link: MARKER_ICON, alt: "marker"}}/>
                <Insight title={`${dataResults?.length} applications`} img={{link: APPS_ICON, alt: "applications"}}/>
                <Insight title={`${gradDate.rounded} days since graduation`}
                         img={{link: GRAD_ICON, alt: "graduation"}}/>
                <Insight
                    title={`${Number(dataResults && dataResults?.length / gradDate.elapsed).toFixed(2)} applications per day`}
                    img={{link: RATIO_ICON, alt: "ratio"}}/>
                <Insight title={`${Number(dataRemote).toFixed(2)}% remote`} img={{link: REMOTE_ICON, alt: "REMOTE"}}/>
            </div>
        );
    }

    function InputFields(): JSX.Element {

        const [lock, setLock] = useState(true);
        const [inputValues, setInputValues] = useState({
            title: "",
            location: "",
            employer: "",
            description: "",
            url: ""
        });

        useEffect(() => {
            if (inputValues.title !== "" && inputValues.location !== "" && inputValues.employer !== "" && inputValues.description !== "" && inputValues.url !== "") {
                setLock(false);
            } else {
                setLock(true);
            }
        }, [inputValues]);

        useEffect(() => {
            function HandleClick(e: any): void {
                if (e.key === "Enter") {
                    const submit = document.getElementById("insert-submit");
                    if (submit && !lock) submit.click();
                }
            }

            document.addEventListener('keydown', HandleClick);
            return () => document.removeEventListener('keydown', HandleClick);
        }, [lock]);

        function SubmitIcon(): JSX.Element {
            return lock ? LOCKED : UNLOCKED;
        }

        function POST(endpoint: string, data: any): void {
            fetch(endpoint, {method: METHODS.POST, headers: post_headers, body: JSON.stringify(data)}
            ).then(response => {
                return response.json()
            }).then(data => {
                if (data['status'] === 'Success!') resetInputValues();
            });
        }

        async function handleSubmit(event: FormEvent<HTMLButtonElement>, values: any): Promise<void> {
            event.preventDefault();
            setIsSubmitting(true);
            POST(endpoints.CAREERS, values);
            setIsSubmitting(false);
            changeMessage("Successfully added a new career!");
            activeMessage(true);
            await refetchCareers();
            await refetchLocations();
        }

        function resetInputValues(): void {
            setInputValues({title: "", location: "", employer: "", description: "", url: ""});
        }

        return (
            <div id="insert-input-fields">
                {input?.map((input, index) => (
                    <Input
                        key={index}
                        className="input-field"
                        params={{
                            value: inputValues[input.name as keyof typeof inputValues],
                            inputType: input.type,
                            name: input.name,
                            placeholder: input.placeholder,
                            onChange: (e) => setInputValues({...inputValues, [input.name]: e.target.value})
                        }}
                    />
                ))}
                <div id={"insert-buttons"}>
                    <Button className={"buttons"} id={"insert-reset"}
                            params={{onClick: resetInputValues, value: "Reset", icon: RESET_ICON}}/>
                    <button
                        className="buttons"
                        id={"insert-submit"}
                        type="submit"
                        disabled={lock}
                        onClick={async (event) => handleSubmit(event, inputValues)}
                    >
                        <SubmitIcon/>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <CSSTransition in={true} appear={true} timeout={1000} classNames="fade">
            <div id="insert-content">
                <div id={"insert-content-wrapper"}>
                    <Message/>
                    <Header/>
                    <InputFields/>
                </div>
            </div>
        </CSSTransition>
    );
}