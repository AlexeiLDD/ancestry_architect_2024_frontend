
const SubmitButtonTitleViaPending = 'Загрузка';
const AddablePoint = '.';
const PointsLength = 4;
const Timeout250Milliseconds = 250;


export class PendingSubmitAnimationBase {
  pending = false;
  submitButtonTitle = '';

  constructor() {}

  protected startLoadingAnimation(): NodeJS.Timeout {
    this.submitButtonTitle = SubmitButtonTitleViaPending;
    this.pending = true;
    let ticker = 0;

    return setInterval(() => {
      this.submitButtonTitle = this.submitButtonTitle.concat(AddablePoint);
      ticker++;

      if (ticker % PointsLength === 0) {
        this.submitButtonTitle = this.submitButtonTitle.slice(0, this.submitButtonTitle.length - PointsLength);
      }
    }, Timeout250Milliseconds);
  }
}
