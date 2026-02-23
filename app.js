const API_URL = "https://opensheet.elk.sh/1JlWQE2-Y-AxrHk1aTVL3Vztfv5-drf11vslgABXuf_Y/Data";

async function fetchDailyData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // 1. חישוב תאריך היום
        const today = new Date();
        const tYear = today.getFullYear();
        const tMonth = today.getMonth(); 
        const tDay = today.getDate();
        
        // פורמט תצוגה יפה
        const displayMonth = String(today.getMonth() + 1).padStart(2, '0');
        const displayDay = String(today.getDate()).padStart(2, '0');
        document.getElementById('dateDisplay').innerText = `${displayDay}/${displayMonth}/${tYear.toString().slice(-2)}`; 

        // 2. חיפוש השורה המתאימה
        const todayData = data.find(row => {
            if (!row.Date) return false;
            const rowDate = new Date(row.Date); 
            return rowDate.getFullYear() === tYear &&
                   rowDate.getMonth() === tMonth &&
                   rowDate.getDate() === tDay;
        });

        if (!todayData) {
            document.getElementById('factDisplay').innerText = "אין עובדה מיוחדת להיום. צאו לשחק בחוץ! 🌞";
            return; 
        }

        // 3. הצגת התוכן
        document.getElementById('factDisplay').innerText = todayData.FactText;

        if(todayData.FamilyEvent) {
            const eventEl = document.getElementById('eventDisplay');
            eventEl.innerText = "🎉 " + todayData.FamilyEvent;
            document.getElementById('eventContainer').style.display = 'block';
        }

        if(todayData.ImageURL) {
            const imgEl = document.getElementById('dailyImage');
            imgEl.src = todayData.ImageURL;
            imgEl.style.display = 'block';
        }

        // 4. הפעלת הקראה בקול של אמא (הפיצ'ר שביקשת)
        if(todayData.FactAudioURL) {
            const factAudio = document.getElementById('factAudioPlayer');
            const playBtn = document.getElementById('playFactAudioBtn');
            
            factAudio.src = todayData.FactAudioURL;
            playBtn.style.display = 'inline-block'; // חושף את הכפתור הכתום
            
            playBtn.onclick = () => {
                factAudio.play();
                // אפקט ויזואלי קטן כשהוא מנגן
                playBtn.innerText = "אמא מקריאה... 🔊";
                factAudio.onended = () => { playBtn.innerText = "שמעי את אמא 🎧"; };
            };
        }

        // 5. נגנים נוספים (הודעה ופודקאסט)
        let hasExtraAudio = false;
        if(todayData.AudioParentURL) {
            document.getElementById('parentAudio').src = todayData.AudioParentURL;
            document.getElementById('parentAudioContainer').style.display = 'block';
            hasExtraAudio = true;
        }
        if(todayData.PodcastURL) {
            document.getElementById('podcastAudio').src = todayData.PodcastURL;
            document.getElementById('podcastContainer').style.display = 'block';
            hasExtraAudio = true;
        }
        if(hasExtraAudio) {
            document.getElementById('audioWrapper').style.display = 'grid';
        }

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('factDisplay').innerText = "אופס, בעיה בחיבור 😔";
    }
}

fetchDailyData();
