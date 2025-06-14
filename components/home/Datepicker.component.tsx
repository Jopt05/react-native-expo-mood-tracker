import { Mood } from '@/apis/mood-tracker/interfaces';
import { ThemeContext } from '@/context/Theme.context';
import React, { useContext, useState } from 'react';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import DayfaceComponent from './Dayface.component';

interface DatePickerComponentProps {
    parentWidth: number;
    moodList: Mood[];
    onDateChange: (date: DateType) => void;
    currentMonth: number;
    currentYear: number;
}

export default function DatePickerComponent({ 
    parentWidth, 
    moodList ,
    onDateChange,
    currentMonth,
    currentYear,
}: DatePickerComponentProps) {

    const { theme } = useContext( ThemeContext )
    const defaultStyles = useDefaultStyles();
    const [selected, setSelected] = useState<DateType>();
    
    const handleDateChange = (date: DateType) => {
        if( !date ) return null;
        setSelected(date);
        onDateChange(date);
    }
    

  return (
    <DateTimePicker
        style={{ width: parentWidth }}
        mode="single"
        navigationPosition="around"
        date={selected}
        month={currentMonth}
        year={currentYear}
        onChange={({ date }) => handleDateChange(date)}
        components={{
            Day(day) {
                const plainDate = new Date(day.date).setHours(0, 0, 0, 0);
                const matchingMood = moodList.find(mood => new Date(mood.createdAt).setHours(0, 0, 0, 0) === plainDate);
                return <DayfaceComponent day={day} matchingMood={matchingMood} />
            },
        }}
        disabledDates={(date) => {
            const plainDate = new Date(date as Date).setHours(0, 0, 0, 0);
            const matchingMood = moodList.find(mood => new Date(mood.createdAt).setHours(0, 0, 0, 0) === plainDate);
            return !matchingMood;
        }}
        styles={{
            ...defaultStyles,
            day_label: {
                color: theme.colors.primary
            },
            month_label: {
                color: theme.colors.primary
            },
            year_label: {
                color: theme.colors.primary
            },
            selected: {
                backgroundColor: theme.colors.card
            },
            weekday_label: {
                color: theme.colors.text
            },
            month_selector_label: {
                color: theme.colors.primary
            },
            year_selector_label: {
                color: theme.colors.primary
            },
            selected_month: {
                backgroundColor: theme.colors.card
            },
            selected_year: {
                backgroundColor: theme.colors.card
            },
            today: {
                backgroundColor: 'transparent'
            },
            button_prev: {
                backgroundColor: theme.colors.card,
                borderRadius: 10,
                color: 'red'
            },
            button_next: {
                backgroundColor: theme.colors.card,
                borderRadius: 10,
                color: 'red'
            },
            button_next_image: {
                tintColor: theme.colors.primary
            },
            button_prev_image: {
                tintColor: theme.colors.primary
            }
        }}
    />
  )
}
