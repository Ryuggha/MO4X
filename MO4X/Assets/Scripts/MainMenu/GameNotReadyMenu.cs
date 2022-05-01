using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class GameNotReadyMenu : MonoBehaviour
{
    private TextEditor textEditor;
    private string inviteCode;

    [SerializeField] private GameObject layoutPosition;
    [SerializeField] private GameObject userNamePrefab;
    [SerializeField] private TextMeshProUGUI numberOfPlayersText;
    [SerializeField] private TextMeshProUGUI inviteCodeText;

    public void initialize(int maxPlayers, string inviteCode, string[] users)
    {
        textEditor = new TextEditor();
        numberOfPlayersText.text = users.Length + "/" + maxPlayers + " Players";
        this.inviteCode = inviteCode;
        inviteCodeText.text = inviteCode;

        foreach (string name in users)
        {
            TextMeshProUGUI text = Instantiate(userNamePrefab, layoutPosition.transform).GetComponent<TextMeshProUGUI>();
            text.text = name;
        }
    }

    public void OnCopyToClipboardClick()
    {
        if (this.textEditor == null) return;
        textEditor.text = inviteCode;
        textEditor.SelectAll();
        textEditor.Copy();
    }

    public void OnBackClick()
    {
        Destroy(gameObject);
    }
}
