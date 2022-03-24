using UnityEngine;
using UnityEngine.Networking;
using TMPro;
using System.Collections;

public class Login : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI loginHelperText;
    [SerializeField] private TMP_InputField usernameField;
    [SerializeField] private TMP_InputField passwordField;

    [Header("WebIntegration")]
    [SerializeField] private string authenticationEndpoint = "http://127.0.0.1:13756/account";

    public void OnLoginClick()
    {
        loginHelperText.text = "Connecting to the server...";
        StartCoroutine(TryLogin());
    }

    private IEnumerator TryLogin()
    {
        string usernameString = usernameField.text;
        string passwordString = passwordField.text;

        UnityWebRequest loginReq = UnityWebRequest.Get(authenticationEndpoint + $"?reqUsername={usernameString}&reqPassword={passwordString}");
        UnityWebRequestAsyncOperation requestHandler = loginReq.SendWebRequest();

        float timeLeft = 10f;
        while (!requestHandler.isDone)
        {
            timeLeft-= Time.deltaTime;

            if (timeLeft < 0)
            {
                break;
            }

            yield return null;
        }

        if (loginReq.result == UnityWebRequest.Result.Success)
        {
            string response = loginReq.downloadHandler.text;
            if (response == "Invalid Credentials")
            {
                loginHelperText.text = "Invalid Credentials";
            }
            else
            {
                loginHelperText.text = $"Welcome to MO4X";
            }
        }
        else
        {
            loginHelperText.text = "Unable to connect to the server...";
        }

        yield return null;
    }
}
