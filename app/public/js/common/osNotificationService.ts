import { ipcRenderer } from 'electron';

interface TrackObject {
  songTitle: string;
  songUser: string;
  songThumbnail: string;
}

class OSNotificationService {
  private songNotification: Notification;

  /**
   * Check if track title needs to be shortened
   * and return
   * @param {string} trackTitle (track title)
   */
  private shortTrackTitle(trackTitle: string): string {
    return (trackTitle.length > 63 && process.platform == "win32") ? trackTitle.substr(0, 60) + "..." : trackTitle;
  }

  /**
   *  Check if user config is enabled to display
   * OS native notification
   *
   * @param {TrackObject} trackObj (track object)
   */
  public show(trackObj: TrackObject): void {
    if (localStorage.notificationToggle === "true") {
      this.songNotification = new Notification(this.shortTrackTitle(trackObj.songTitle), {
        body: trackObj.songUser,
        icon: trackObj.songThumbnail,
        silent: true
      });
      this.songNotification.onclick = () => {
        ipcRenderer.send('showApp');
      };
    }
  }
}

export default OSNotificationService;
