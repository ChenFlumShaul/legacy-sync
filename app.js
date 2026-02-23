const API_URL = "https://opensheet.elk.sh/1JlWQE2-Y-AxrHk1aTVL3Vztfv5-drf11vslgABXuf_Y/Data";

async function fetchDailyData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // 1. שמירת הערכים המספריים של היום (שנה, חודש, יום)
        const today = new Date();
        const tYear = today.getFullYear();
        const tMonth = today.getMonth(); // בחודשים המחשב סופר מ-0 עד 11
        const tDay = today.getDate();
        
        // 2. יצירת המחרוזת לתצוגה יפה במסך (למשל: 22/02/26)
        const displayMonth = String(today.getMonth() + 1).padStart(2, '0');
        const displayDay = String(today.getDate()).padStart(2, '0');
        const todayStringDisplay = `${displayDay}/${displayMonth}/${tYear.toString().slice(-2)}`; 

        document.getElementById('dateDisplay').innerText = todayStringDisplay;

        // 3. החיפוש החכם (Smart Parser)
        const todayData = data.find(row => {
            if (!row.Date) return false; // מתעלם משורות ריקות באקסל
            
            // המחשב מנסה להבין את התאריך מהאקסל, לא משנה באיזה פורמט הוא נכתב!
            const rowDate = new Date(row.Date); 
            
            // בודק התאמה מדויקת של יום, חודש ושנה
            return rowDate.getFullYear() === tYear &&
                   rowDate.getMonth() === tMonth &&
                   rowDate.getDate() === tDay;
        });

        // 4. אם אין נתונים להיום
        if (!todayData) {
            document.getElementById('factDisplay').innerText = "אין עובדה מיוחדת להיום. צאו לשחק בחוץ! 🌞";
            document.getElementById('factDisplay').classList.remove('loading');
            return; 
        }

        // 5. שתילת הנתונים
        document.getElementById('factDisplay').innerText = todayData.FactText;
        document.getElementById('factDisplay').classList.remove('loading');

        if(todayData.FamilyEvent) {
            document.getElementById('eventDisplay').innerText = "🎉 " + todayData.FamilyEvent;
        }

        if(todayData.ImageURL) {
            const imgEl = document.getElementById('dailyImage');
            imgEl.src = todayData.ImageURL;
            imgEl.style.display = 'block';
        }

        if(todayData.FactAudioURL) {
            const factAudio = document.getElementById('factAudioPlayer');
            const playBtn = document.getElementById('playFactAudioBtn');
            
            factAudio.src = todayData.FactAudioURL;
            playBtn.style.display = 'inline-block'; 
            
            playBtn.addEventListener('click', () => {
                factAudio.play();
            });
        }

        let hasAnyAudio = false;
        
        if(todayData.AudioParentURL) {
            document.getElementById('parentAudio').src = todayData.AudioParentURL;
            document.getElementById('parentAudioContainer').style.display = 'block';
            hasAnyAudio = true;
        }

        if(todayData.PodcastURL) {
            document.getElementById('podcastAudio').src = todayData.PodcastURL;
            document.getElementById('podcastContainer').style.display = 'block';
            hasAnyAudio = true;
        }

        if(hasAnyAudio) {
            document.getElementById('audioWrapper').style.display = 'block';
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('factDisplay').innerText = "אופס, לא הצלחנו להתחבר לאינטרנט 😔";
        document.getElementById('factDisplay').classList.remove('loading');
    }
}

fetchDailyData();